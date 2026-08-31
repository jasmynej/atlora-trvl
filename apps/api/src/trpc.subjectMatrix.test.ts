import { db, platformUsers, sessions, type SubjectType } from '@atlora/db'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { hashPassword } from './lib/auth/password'
import { createSession } from './lib/auth/session'
import { agencyProcedure, createCallerFactory, platformProcedure, router, travelerProcedure } from './trpc'

// Minimal router that exists only to exercise each subject-scoped
// procedure guard directly, without going over HTTP.
const testRouter = router({
  platformOnly: platformProcedure.query(() => 'platform-ok'),
  agencyOnly: agencyProcedure.query(() => 'agency-ok'),
  travelerOnly: travelerProcedure.query(() => 'traveler-ok'),
})
const createCaller = createCallerFactory(testRouter)

function contextWithCookie(cookieHeader: string | null) {
  return {
    req: new Request('http://localhost/trpc', {
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    }),
    resHeaders: new Headers(),
    ip: null,
    userAgent: null,
  }
}

describe('subject_type × procedure matrix', () => {
  let platformUserId: string
  const sessionIds: string[] = []
  const tokensBySubject: Record<SubjectType, string> = { platform: '', agency: '', traveler: '' }

  beforeAll(async () => {
    const [user] = await db
      .insert(platformUsers)
      .values({
        email: `matrix-test-${crypto.randomUUID()}@atlora.test`,
        passwordHash: await hashPassword('irrelevant-not-used-by-this-test'),
        name: 'Matrix Test User',
        role: 'platform_admin',
        status: 'active',
      })
      .returning()
    platformUserId = user!.id

    for (const subjectType of ['platform', 'agency', 'traveler'] as const) {
      const { token, session } = await createSession(db, {
        subjectType,
        // For 'platform' this must be a real, active platform_users row —
        // platformProcedure loads and status-checks it. 'agency'/'traveler'
        // use an arbitrary id on purpose: no backing table exists yet
        // (Milestone 3+), and agencyProcedure/travelerProcedure are
        // deliberately thin session-only guards until it does.
        subjectId: subjectType === 'platform' ? platformUserId : `fake-${subjectType}-id`,
      })
      tokensBySubject[subjectType] = token
      sessionIds.push(session.id)
    }
  })

  afterAll(async () => {
    for (const id of sessionIds) {
      await db.delete(sessions).where(eq(sessions.id, id))
    }
    await db.delete(platformUsers).where(eq(platformUsers.id, platformUserId))
  })

  const cookieNameFor: Record<SubjectType, string> = {
    platform: 'atlora_platform_session',
    agency: 'atlora_agency_session',
    traveler: 'atlora_traveler_session',
  }

  const procedureCalls: Record<SubjectType, (caller: ReturnType<typeof createCaller>) => Promise<unknown>> = {
    platform: (caller) => caller.platformOnly(),
    agency: (caller) => caller.agencyOnly(),
    traveler: (caller) => caller.travelerOnly(),
  }

  // The diagonal (session subject_type matches the procedure's expected
  // subject_type) succeeds; every off-diagonal combination must reject on
  // the explicit subject_type assertion, not as a side effect of a null
  // lookup (§ Milestone 1 acceptance criteria). Because platformProcedure
  // additionally requires a real, active platform_users row — and
  // agencyProcedure/travelerProcedure do not yet have an equivalent table
  // to check against — the diagonal here is 3 of 9, not the "two of nine"
  // shape the handoff's "seven of nine must fail" line implies; see the
  // Milestone 1 report for why. What matters for this milestone is that
  // every off-diagonal combination fails on subject_type, which this
  // matrix does assert, for all 6 of them.
  const sessionSubjects: SubjectType[] = ['platform', 'agency', 'traveler']
  const procedureSubjects: SubjectType[] = ['platform', 'agency', 'traveler']

  for (const sessionSubject of sessionSubjects) {
    for (const procedureSubject of procedureSubjects) {
      const shouldSucceed = sessionSubject === procedureSubject

      it(`${sessionSubject} session × ${procedureSubject} procedure → ${shouldSucceed ? 'allowed' : 'rejected'}`, async () => {
        const cookie = `${cookieNameFor[procedureSubject]}=${tokensBySubject[sessionSubject]}`
        const caller = createCaller(contextWithCookie(cookie))
        const call = procedureCalls[procedureSubject](caller)

        if (shouldSucceed) {
          await expect(call).resolves.toBeDefined()
        } else {
          await expect(call).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
        }
      })
    }
  }
})

describe('platformProcedure — no-session-shaped rejections', () => {
  const testRouter2 = router({ ping: platformProcedure.query(() => 'pong') })
  const createCaller2 = createCallerFactory(testRouter2)

  it('rejects with no cookie at all', async () => {
    const caller = createCaller2(contextWithCookie(null))
    await expect(caller.ping()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
  })

  it('rejects an unrecognized token', async () => {
    const caller = createCaller2(contextWithCookie('atlora_platform_session=not-a-real-token'))
    await expect(caller.ping()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
  })

  it('rejects a session whose backing platform user is suspended', async () => {
    const [user] = await db
      .insert(platformUsers)
      .values({
        email: `suspended-test-${crypto.randomUUID()}@atlora.test`,
        passwordHash: await hashPassword('irrelevant'),
        name: 'Suspended Test User',
        role: 'platform_admin',
        status: 'suspended',
      })
      .returning()

    const { token, session } = await createSession(db, { subjectType: 'platform', subjectId: user!.id })

    try {
      const caller = createCaller2(contextWithCookie(`atlora_platform_session=${token}`))
      await expect(caller.ping()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
    } finally {
      await db.delete(sessions).where(eq(sessions.id, session.id))
      await db.delete(platformUsers).where(eq(platformUsers.id, user!.id))
    }
  })
})
