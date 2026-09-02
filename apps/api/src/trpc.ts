import { auditLogs, db, platformUsers, type SubjectType } from '@atlora/db'
import { TRPCError, initTRPC } from '@trpc/server'
import { PLATFORM_SESSION_COOKIE, readSessionCookie } from './lib/auth/cookies'
import { resolveSession, type Session } from './lib/auth/session'

export interface Context {
  req: Request
  resHeaders: Headers
  ip: string | null
  userAgent: string | null
}

type Db = typeof db
type Tx = Parameters<Parameters<Db['transaction']>[0]>[0]

export interface AuditEntry {
  subjectType: SubjectType
  subjectId: string
  before: unknown
  after: unknown
}

/**
 * Populated by a mutation resolver via `ctx.audit.record(...)`. Read by the
 * audit `.use()` step in platformProcedure/platformEditorProcedure after
 * the resolver returns, and written to audit_logs in the same transaction
 * the resolver used.
 */
export class AuditRecorder {
  private entry: AuditEntry | null = null
  record(entry: AuditEntry): void {
    this.entry = entry
  }
  get recorded(): AuditEntry | null {
    return this.entry
  }
}

class AuditBailout extends Error {
  constructor(public result: unknown) {
    super('audit-bailout')
  }
}

// Named context types, not inline object literals, are load-bearing here:
// tRPC's `declaration: true` build needs to name the type of every exported
// procedure, and an anonymous object type built from a Drizzle row type
// plus tRPC's own internal generics is exactly the combination that
// produces "cannot be named without a reference to .../schema" (TS2742).
// Giving the augmented context an exported interface fixes it.
export interface PlatformAuthContext extends Context {
  platformUser: typeof platformUsers.$inferSelect
  session: Session
}

export interface PlatformMutationContext extends PlatformAuthContext {
  tx: Tx | undefined
  audit: AuditRecorder | undefined
}

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    // Stack traces are a dev convenience, not something to ship on the
    // highest-privilege surface in the system.
    if (process.env.NODE_ENV === 'production') {
      return { ...shape, data: { ...shape.data, stack: undefined } }
    }
    return shape
  },
})

export const router = t.router
export const publicProcedure = t.procedure
/** Exported for server-side testing only — builds a caller without going over HTTP. */
export const createCallerFactory = t.createCallerFactory

/**
 * Resolves the session for `cookieName` and asserts its subject_type. The
 * assertion is a distinct, explicit check — not a side effect of the lookup
 * finding nothing — because a session row can exist with the *wrong*
 * subject_type (e.g. an agency session token replayed against the platform
 * cookie name) and that must fail differently in tests/logs than "no
 * session at all". Shared by every subject-scoped procedure; only the
 * cookie name and expected subject_type vary per subject type.
 */
async function resolveSubjectSession(ctx: Context, cookieName: string, expected: SubjectType) {
  const token = readSessionCookie(ctx.req.headers.get('cookie'), cookieName)
  if (!token) throw new TRPCError({ code: 'UNAUTHORIZED' })

  const session = await resolveSession(db, token)
  if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' })

  if (session.subjectType !== expected) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return session
}

async function resolveActivePlatformUser(ctx: Context) {
  const session = await resolveSubjectSession(ctx, PLATFORM_SESSION_COOKIE, 'platform')
  const user = await db.query.platformUsers.findFirst({ where: { id: session.subjectId } })
  if (!user || user.status !== 'active') {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return { user, session }
}

/**
 * Writes the audit_logs row inside `tx` once the resolver has populated
 * `audit`, or throws if it didn't — "every platformProcedure mutation
 * writes an AuditLog row" (§ Milestone 1) is enforced here, in every
 * environment, not just development. Drizzle has no ORM-level query hooks,
 * so "before" state can't be captured automatically the way it would be in
 * an ORM with middleware — instead the resolver is handed `ctx.tx` (so its
 * own writes and this audit row share one transaction) and `ctx.audit`, and
 * must call `ctx.audit.record(...)` itself before returning.
 */
async function finishAuditedMutation(
  tx: Tx,
  audit: AuditRecorder,
  meta: { actorId: string; path: string; ip: string | null; userAgent: string | null }
): Promise<void> {
  const entry = audit.recorded
  if (!entry) {
    throw new Error(
      `platformProcedure mutation "${meta.path}" completed without calling ctx.audit.record(...) — every mutation must populate the audit context.`
    )
  }

  await tx.insert(auditLogs).values({
    actorId: meta.actorId,
    action: meta.path,
    subjectType: entry.subjectType,
    subjectId: entry.subjectId,
    before: entry.before as object | null,
    after: entry.after as object | null,
    ip: meta.ip,
    userAgent: meta.userAgent,
  })
}

/**
 * Both procedures below repeat the same two `.use()` steps rather than
 * sharing a factored-out middleware value. That's deliberate: a
 * `t.middleware()` built standalone, or two `next()` calls with
 * structurally different object literals, both defeated tRPC's inference
 * of the added `platformUser`/`session`/`tx`/`audit` context fields in
 * practice. Writing each `.use()` inline, against the named
 * PlatformAuthContext/PlatformMutationContext types above, is what makes
 * the inference (and the .d.ts build) work. The non-type-sensitive parts
 * are still shared, via resolveActivePlatformUser and
 * finishAuditedMutation.
 */
export const platformProcedure = t.procedure
  .use(async ({ ctx, next }) => {
    const { user, session } = await resolveActivePlatformUser(ctx)
    const nextCtx: PlatformAuthContext = { ...ctx, platformUser: user, session }
    return next({ ctx: nextCtx })
  })
  .use(async ({ ctx, next, path, type }) => {
    if (type !== 'mutation') {
      const nextCtx: PlatformMutationContext = { ...ctx, tx: undefined, audit: undefined }
      return next({ ctx: nextCtx })
    }

    try {
      return await db.transaction(async (tx) => {
        const audit = new AuditRecorder()
        const nextCtx: PlatformMutationContext = { ...ctx, tx, audit }
        const result = await next({ ctx: nextCtx })

        if (!result.ok) {
          // Roll back whatever the resolver wrote before failing, then
          // re-surface the original result once we're outside the tx.
          throw new AuditBailout(result)
        }

        await finishAuditedMutation(tx, audit, {
          actorId: ctx.platformUser.id,
          path,
          ip: ctx.ip,
          userAgent: ctx.userAgent,
        })

        return result
      })
    } catch (err) {
      if (err instanceof AuditBailout) return err.result as Awaited<ReturnType<typeof next>>
      throw err
    }
  })

/** Catalog-only role gate. platform_admin also passes — editor is a subset of admin, not a sibling. */
export const platformEditorProcedure = t.procedure
  .use(async ({ ctx, next }) => {
    const { user, session } = await resolveActivePlatformUser(ctx)
    if (user.role !== 'platform_admin' && user.role !== 'platform_editor') {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }
    const nextCtx: PlatformAuthContext = { ...ctx, platformUser: user, session }
    return next({ ctx: nextCtx })
  })
  .use(async ({ ctx, next, path, type }) => {
    if (type !== 'mutation') {
      const nextCtx: PlatformMutationContext = { ...ctx, tx: undefined, audit: undefined }
      return next({ ctx: nextCtx })
    }

    try {
      return await db.transaction(async (tx) => {
        const audit = new AuditRecorder()
        const nextCtx: PlatformMutationContext = { ...ctx, tx, audit }
        const result = await next({ ctx: nextCtx })

        if (!result.ok) {
          throw new AuditBailout(result)
        }

        await finishAuditedMutation(tx, audit, {
          actorId: ctx.platformUser.id,
          path,
          ip: ctx.ip,
          userAgent: ctx.userAgent,
        })

        return result
      })
    } catch (err) {
      if (err instanceof AuditBailout) return err.result as Awaited<ReturnType<typeof next>>
      throw err
    }
  })

/**
 * Thin guard for agency and traveler sessions — no agency_users /
 * traveler_profiles table exists yet (those land in Milestone 3 and a later
 * milestone respectively), so unlike platformProcedure this only resolves
 * the session row and asserts subject_type; it does not load or
 * status-check a per-subject account row. Once those tables exist, extend
 * this the same way platformProcedure loads and checks platformUsers.
 */
export const agencyProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await resolveSubjectSession(ctx, 'atlora_agency_session', 'agency')
  return next({ ctx: { ...ctx, subjectType: 'agency' as const, subjectId: session.subjectId, session } })
})

export const travelerProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await resolveSubjectSession(ctx, 'atlora_traveler_session', 'traveler')
  return next({ ctx: { ...ctx, subjectType: 'traveler' as const, subjectId: session.subjectId, session } })
})

export type { Tx }
