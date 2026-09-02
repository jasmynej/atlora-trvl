import { auditLogs, db, platformUsers, sessions } from '@atlora/db'
import { eq } from 'drizzle-orm'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { hashPassword } from './lib/auth/password'
import { createSession } from './lib/auth/session'
import { createCallerFactory, platformProcedure, router } from './trpc'

// A throwaway table-free "record" for the resolver to write via ctx.tx —
// standing in for a real mutation like destinations.update in Milestone 2.
// We just need something that proves the audit row and the resolver's own
// write share one transaction.
const testRouter = router({
  compliant: platformProcedure.mutation(({ ctx }) => {
    // ctx.audit is typed `AuditRecorder | undefined` because the same
    // middleware also serves query procedures (where it's undefined) — see
    // withAuditMiddleware in trpc.ts. It's always defined for mutations.
    ctx.audit!.record({ subjectType: 'platform', subjectId: 'destination-123', before: { name: 'old' }, after: { name: 'new' } })
    return { ok: true }
  }),
  forgetsToRecord: platformProcedure.mutation(() => {
    return { ok: true }
  }),
  queryDoesNotNeedAudit: platformProcedure.query(() => 'no-audit-required-for-queries'),
})
const createCaller = createCallerFactory(testRouter)

describe('platformProcedure audit middleware', () => {
  let platformUser: typeof platformUsers.$inferSelect
  let token: string
  let sessionId: string

  beforeAll(async () => {
    const [user] = await db
      .insert(platformUsers)
      .values({
        email: `audit-test-${crypto.randomUUID()}@atlora.test`,
        passwordHash: await hashPassword('irrelevant'),
        name: 'Audit Test User',
        role: 'platform_admin',
        status: 'active',
      })
      .returning()
    platformUser = user!

    const created = await createSession(db, { subjectType: 'platform', subjectId: platformUser.id })
    token = created.token
    sessionId = created.session.id
  })

  afterAll(async () => {
    await db.delete(sessions).where(eq(sessions.id, sessionId))
    await db.delete(platformUsers).where(eq(platformUsers.id, platformUser.id))
  })

  afterEach(async () => {
    await db.delete(auditLogs).where(eq(auditLogs.actorId, platformUser.id))
  })

  function caller() {
    return createCaller({
      req: new Request('http://localhost/trpc', { headers: { cookie: `atlora_platform_session=${token}` } }),
      resHeaders: new Headers(),
      ip: '127.0.0.1',
      userAgent: 'vitest',
    })
  }

  it('writes an audit_logs row when the resolver calls ctx.audit.record', async () => {
    await caller().compliant()

    const rows = await db.select().from(auditLogs).where(eq(auditLogs.actorId, platformUser.id))
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      action: 'compliant',
      subjectType: 'platform',
      subjectId: 'destination-123',
      before: { name: 'old' },
      after: { name: 'new' },
    })
  })

  it('throws — does not silently write an empty log — when the resolver forgets to record', async () => {
    await expect(caller().forgetsToRecord()).rejects.toThrow(/without calling ctx\.audit\.record/)

    const rows = await db.select().from(auditLogs).where(eq(auditLogs.actorId, platformUser.id))
    expect(rows).toHaveLength(0)
  })

  it('does not require ctx.audit for queries', async () => {
    await expect(caller().queryDoesNotNeedAudit()).resolves.toBe('no-audit-required-for-queries')
  })
})
