import { db, sessions } from '@atlora/db'
import { eq } from 'drizzle-orm'
import { afterEach, describe, expect, it } from 'vitest'
import { SESSION_IDLE_TIMEOUT_MS, createSession, resolveSession, revokeSession } from './session'

// Fully generic across subject types — these tests deliberately use
// 'agency' and 'traveler' subject IDs that don't correspond to any real
// row, since sessions.subjectId is not a real FK (§3 of the handoff) and
// this module has no opinion on what subject_id resolves to. That's the
// caller's job (see trpc.ts).
const createdSessionIds: string[] = []

afterEach(async () => {
  while (createdSessionIds.length > 0) {
    const id = createdSessionIds.pop()!
    await db.delete(sessions).where(eq(sessions.id, id))
  }
})

async function makeSession(subjectType: 'platform' | 'agency' | 'traveler' = 'platform') {
  const { token, session } = await createSession(db, {
    subjectType,
    subjectId: `test-subject-${crypto.randomUUID()}`,
  })
  createdSessionIds.push(session.id)
  return { token, session }
}

describe('session lifecycle', () => {
  it('resolves a freshly created session', async () => {
    const { token, session } = await makeSession('platform')
    const resolved = await resolveSession(db, token)
    expect(resolved?.id).toBe(session.id)
  })

  it('stores only the token hash, never the raw token', async () => {
    const { token, session } = await makeSession()
    expect(session.tokenHash).not.toBe(token)
    expect(session.tokenHash).toMatch(/^[0-9a-f]{64}$/) // sha256 hex
  })

  it('returns null for a token that does not exist', async () => {
    const resolved = await resolveSession(db, 'not-a-real-token')
    expect(resolved).toBeNull()
  })

  it('returns null once revoked', async () => {
    const { token } = await makeSession()
    await revokeSession(db, token)
    expect(await resolveSession(db, token)).toBeNull()
  })

  it('returns null once past its absolute expiry', async () => {
    const { token, session } = await makeSession()
    await db.update(sessions).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(sessions.id, session.id))
    expect(await resolveSession(db, token)).toBeNull()
  })

  it('returns null once idle past the idle timeout, even before absolute expiry', async () => {
    const { token, session } = await makeSession()
    await db
      .update(sessions)
      .set({ lastUsedAt: new Date(Date.now() - SESSION_IDLE_TIMEOUT_MS - 1000) })
      .where(eq(sessions.id, session.id))
    expect(await resolveSession(db, token)).toBeNull()
  })

  it('touches last_used_at on successful resolution', async () => {
    const { token, session } = await makeSession()
    const before = session.lastUsedAt.getTime()
    await new Promise((resolve) => setTimeout(resolve, 5))
    await resolveSession(db, token)
    const [row] = await db.select().from(sessions).where(eq(sessions.id, session.id))
    expect(row!.lastUsedAt.getTime()).toBeGreaterThan(before)
  })

  it('does not filter by subject_type — that is the caller layer\'s job', async () => {
    const { token, session } = await makeSession('agency')
    const resolved = await resolveSession(db, token)
    expect(resolved?.id).toBe(session.id)
    expect(resolved?.subjectType).toBe('agency')
  })
})
