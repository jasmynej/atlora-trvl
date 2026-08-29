import { verifyToken } from '@clerk/backend'
import { auditLogs, db, platformUsers } from '@atlora/db'
import { initTRPC, TRPCError } from '@trpc/server'

// ── Auth context ─────────────────────────────────────────────────────────────
// Clerk session claims, resolved once per request from the bearer token. `orgId`
// is present only when the session has an active organization — an agency
// session. A platform-admin session is always org-less.

export interface AuthContext {
  userId: string
  orgId: string | null
}

export interface Context {
  db: typeof db
  auth: AuthContext | null
  ip: string | null
  userAgent: string | null
}

async function resolveAuth(headers: Headers): Promise<AuthContext | null> {
  const authorization = headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return null

  const secretKey = process.env.CLERK_SECRET_KEY
  if (!secretKey) {
    // A missing secret key must never silently downgrade every request to
    // "unauthenticated" — that would look like public access working as
    // intended. Fail the request instead of the auth check.
    throw new Error('CLERK_SECRET_KEY is not set — cannot verify any session.')
  }

  const token = authorization.slice('Bearer '.length)
  try {
    const payload = await verifyToken(token, { secretKey })
    return { userId: payload.sub, orgId: payload.org_id ?? null }
  } catch {
    return null
  }
}

export async function createContext({ req }: { req: Request }): Promise<Context> {
  return {
    db,
    auth: await resolveAuth(req.headers),
    ip: req.headers.get('x-forwarded-for'),
    userAgent: req.headers.get('user-agent'),
  }
}

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

// ── Agency scope ──────────────────────────────────────────────────────────────
// Rejects explicitly whenever the org claim is missing, rather than leaving an
// org-less session to fail later on a null agencyId lookup. There is no Agency
// table yet (see Phase 0 report), so this stops at asserting the org claim —
// resolving `orgId` to an Agency row is Milestone 3's job.
export const agencyProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.auth?.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
  if (!ctx.auth.orgId) throw new TRPCError({ code: 'FORBIDDEN' })
  return next({ ctx: { ...ctx, auth: { ...ctx.auth, orgId: ctx.auth.orgId } } })
})

// ── Platform scope ───────────────────────────────────────────────────────────

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

export interface AuditEntry {
  action: string
  subjectType: string
  subjectId: string
  before?: unknown
  after?: unknown
}

/** Writes an AuditLog row using the mutation's own transaction, so the log and
 *  the write it describes commit atomically. Call once, inside `db.transaction`. */
export type AuditRecorder = (tx: Tx, entry: AuditEntry) => Promise<void>

export const platformProcedure = publicProcedure.use(async ({ ctx, next, type }) => {
  if (!ctx.auth?.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })
  if (ctx.auth.orgId) {
    // An agency-org session hitting the platform surface — wrong surface,
    // not a permissions edge case.
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  const platformUser = await ctx.db.query.platformUsers.findFirst({
    where: { clerkUserId: ctx.auth.userId },
  })
  if (!platformUser || platformUser.status !== 'active') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  // Attached unconditionally (queries included) so the procedure's context
  // type is uniform — a conditional shape here would make TS infer `audit`
  // away from query-only branches and break every mutation built on top.
  let recorded = false
  const audit: AuditRecorder = async (tx, entry) => {
    await tx.insert(auditLogs).values({
      actorId: platformUser.id,
      action: entry.action,
      subjectType: entry.subjectType,
      subjectId: entry.subjectId,
      before: entry.before ?? null,
      after: entry.after ?? null,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    })
    recorded = true
  }

  const result = await next({ ctx: { ...ctx, platformUser, audit } })

  if (type === 'mutation' && !recorded) {
    // A hard constraint, not a dev convenience: every platformProcedure
    // mutation must produce an AuditLog row. Throwing here (in every
    // environment, not just development) is what makes that a guarantee
    // rather than a convention someone can forget.
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message:
        'platformProcedure mutation completed without calling ctx.audit(tx, entry). ' +
        'Every platform mutation must record an AuditLog row inside its own transaction.',
    })
  }

  return result
})

// Catalog-only role. Both platform roles may reach catalog routes; this
// exists so a future third role isn't accidentally let in by reusing
// platformProcedure everywhere.
export const platformEditorProcedure = platformProcedure.use(async ({ ctx, next }) => {
  if (ctx.platformUser.role !== 'platform_admin' && ctx.platformUser.role !== 'platform_editor') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next({ ctx })
})

// Agency/billing/provisioning routes — editors are catalog-only and must not
// reach these.
export const platformAdminProcedure = platformProcedure.use(async ({ ctx, next }) => {
  if (ctx.platformUser.role !== 'platform_admin') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next({ ctx })
})
