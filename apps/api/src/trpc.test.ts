import type { platformUsers } from '@atlora/db'
import { describe, expect, it } from 'vitest'
import { agencyProcedure, platformProcedure, router, type Context } from './trpc'

type PlatformUser = typeof platformUsers.$inferSelect

const activePlatformUser: PlatformUser = {
  id: 'pu_1',
  clerkUserId: 'user_1',
  email: 'admin@atlora.com',
  name: 'Admin',
  role: 'platform_admin',
  status: 'active',
  createdAt: new Date(),
  lastActiveAt: null,
}

function makeCtx(
  overrides: Partial<Omit<Context, 'db'>> & { platformUser?: PlatformUser | null } = {}
): Context {
  const { platformUser = activePlatformUser, ...rest } = overrides
  const db = {
    query: {
      platformUsers: {
        findFirst: async () => platformUser,
      },
    },
    transaction: async (fn: (tx: unknown) => unknown) =>
      fn({ insert: () => ({ values: async () => undefined }) }),
  }
  return {
    auth: { userId: 'user_1', orgId: null },
    ip: null,
    userAgent: null,
    db: db as unknown as Context['db'],
    ...rest,
  }
}

const testRouter = router({
  platformPing: platformProcedure.query(() => 'ok'),
  platformMutate: platformProcedure.mutation(async ({ ctx }) => {
    await ctx.db.transaction(async (tx) => {
      await ctx.audit(tx, { action: 'test.mutate', subjectType: 'test', subjectId: '1' })
    })
    return 'ok'
  }),
  platformMutateNoAudit: platformProcedure.mutation(async () => 'ok'),
  agencyPing: agencyProcedure.query(() => 'ok'),
})

describe('platformProcedure', () => {
  it('rejects when there is no authenticated user', async () => {
    const caller = testRouter.createCaller(makeCtx({ auth: null }))
    await expect(caller.platformPing()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
  })

  it('rejects an agency-org session — wrong surface', async () => {
    const caller = testRouter.createCaller(makeCtx({ auth: { userId: 'user_1', orgId: 'org_1' } }))
    await expect(caller.platformPing()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('rejects a session with no matching PlatformUser row', async () => {
    const caller = testRouter.createCaller(makeCtx({ platformUser: null }))
    await expect(caller.platformPing()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('rejects a suspended PlatformUser', async () => {
    const caller = testRouter.createCaller(
      makeCtx({ platformUser: { ...activePlatformUser, status: 'suspended' } })
    )
    await expect(caller.platformPing()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('allows an active platform user through', async () => {
    const caller = testRouter.createCaller(makeCtx())
    await expect(caller.platformPing()).resolves.toBe('ok')
  })

  it('throws if a mutation completes without recording an audit entry', async () => {
    const caller = testRouter.createCaller(makeCtx())
    await expect(caller.platformMutateNoAudit()).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
    })
  })

  it('succeeds when the mutation records an audit entry via ctx.audit', async () => {
    const caller = testRouter.createCaller(makeCtx())
    await expect(caller.platformMutate()).resolves.toBe('ok')
  })
})

describe('agencyProcedure', () => {
  it('rejects a session with no org claim, explicitly', async () => {
    const caller = testRouter.createCaller(makeCtx({ auth: { userId: 'user_1', orgId: null } }))
    await expect(caller.agencyPing()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('allows a session with an org claim', async () => {
    const caller = testRouter.createCaller(makeCtx({ auth: { userId: 'user_1', orgId: 'org_1' } }))
    await expect(caller.agencyPing()).resolves.toBe('ok')
  })
})
