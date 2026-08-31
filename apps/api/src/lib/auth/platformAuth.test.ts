import { db, platformUsers, sessions } from '@atlora/db'
import { eq } from 'drizzle-orm'
import { afterEach, describe, expect, it } from 'vitest'
import { AuthError, authenticatePlatformUser, logoutPlatformUser, normalizePlatformEmail } from './platformAuth'
import { resolveSession } from './session'

const PASSWORD = 'correct-horse-battery-staple'

// Normalizes email the same way every real write path does (CLI, and this
// module's own authenticatePlatformUser lookup) — email storage is
// lowercased-on-write by convention rather than a citext column (see the
// comment on platformUsers.email in packages/db/src/schema.ts), so a helper
// that bypassed normalization would test a state no real code path creates.
async function makeUser(overrides: Partial<typeof platformUsers.$inferInsert> = {}) {
  const { hashPassword } = await import('./password')
  const [user] = await db
    .insert(platformUsers)
    .values({
      email: normalizePlatformEmail(`login-test-${crypto.randomUUID()}@atlora.test`),
      passwordHash: await hashPassword(PASSWORD),
      name: 'Login Test User',
      role: 'platform_admin',
      status: 'active',
      ...overrides,
      ...(overrides.email ? { email: normalizePlatformEmail(overrides.email) } : {}),
    })
    .returning()
  return user!
}

// Each test uses its own IP so the shared in-memory rate limiter can't leak
// attempt counts across tests in this file.
function uniqueIp() {
  return `test-ip-${crypto.randomUUID()}`
}

const createdUserIds: string[] = []

afterEach(async () => {
  while (createdUserIds.length > 0) {
    const id = createdUserIds.pop()!
    await db.delete(sessions).where(eq(sessions.subjectId, id))
    await db.delete(platformUsers).where(eq(platformUsers.id, id))
  }
})

describe('authenticatePlatformUser', () => {
  it('succeeds with correct credentials and issues a resolvable session', async () => {
    const user = await makeUser()
    createdUserIds.push(user.id)

    const { token } = await authenticatePlatformUser({ email: user.email, password: PASSWORD, ip: uniqueIp() })

    const resolved = await resolveSession(db, token)
    expect(resolved?.subjectType).toBe('platform')
    expect(resolved?.subjectId).toBe(user.id)
  })

  it('updates lastLoginAt and resets failedLoginCount on success', async () => {
    const user = await makeUser({ failedLoginCount: 2 })
    createdUserIds.push(user.id)

    await authenticatePlatformUser({ email: user.email, password: PASSWORD, ip: uniqueIp() })

    const [row] = await db.select().from(platformUsers).where(eq(platformUsers.id, user.id))
    expect(row!.failedLoginCount).toBe(0)
    expect(row!.lastLoginAt).not.toBeNull()
  })

  it('is case-insensitive on email at login, regardless of how it was typed', async () => {
    const user = await makeUser() // stored lowercased, like every real write path
    createdUserIds.push(user.id)

    await expect(
      authenticatePlatformUser({ email: user.email.toUpperCase(), password: PASSWORD, ip: uniqueIp() })
    ).resolves.toBeDefined()
  })

  it('rejects a wrong password without revealing whether the email exists', async () => {
    const user = await makeUser()
    createdUserIds.push(user.id)

    const unknownAttempt = authenticatePlatformUser({ email: 'nobody@atlora.test', password: 'x', ip: uniqueIp() })
    const wrongPasswordAttempt = authenticatePlatformUser({ email: user.email, password: 'wrong', ip: uniqueIp() })

    await expect(unknownAttempt).rejects.toBeInstanceOf(AuthError)
    await expect(wrongPasswordAttempt).rejects.toBeInstanceOf(AuthError)
    await expect(unknownAttempt.catch((e) => e.message)).resolves.toBe(
      await wrongPasswordAttempt.catch((e) => e.message)
    )
  })

  it('locks the account after 5 consecutive failed attempts, and rejects the correct password while locked', async () => {
    const user = await makeUser()
    createdUserIds.push(user.id)
    const ip = uniqueIp()

    for (let i = 0; i < 5; i++) {
      await authenticatePlatformUser({ email: user.email, password: 'wrong', ip }).catch(() => {})
    }

    const [row] = await db.select().from(platformUsers).where(eq(platformUsers.id, user.id))
    expect(row!.lockedUntil).not.toBeNull()
    expect(row!.lockedUntil!.getTime()).toBeGreaterThan(Date.now())

    await expect(authenticatePlatformUser({ email: user.email, password: PASSWORD, ip })).rejects.toMatchObject({
      code: 'LOCKED',
    })
  })

  it('rejects a suspended account even with the correct password', async () => {
    const user = await makeUser({ status: 'suspended' })
    createdUserIds.push(user.id)

    await expect(
      authenticatePlatformUser({ email: user.email, password: PASSWORD, ip: uniqueIp() })
    ).rejects.toMatchObject({ code: 'INACTIVE' })
  })

  it('rate-limits repeated attempts from one IP regardless of email', async () => {
    const ip = uniqueIp()
    let sawRateLimited = false

    for (let i = 0; i < 15; i++) {
      try {
        await authenticatePlatformUser({ email: `nobody-${i}@atlora.test`, password: 'x', ip })
      } catch (err) {
        if (err instanceof AuthError && err.code === 'RATE_LIMITED') sawRateLimited = true
      }
    }

    expect(sawRateLimited).toBe(true)
  })
})

describe('logoutPlatformUser', () => {
  it('revokes the session server-side', async () => {
    const user = await makeUser()
    createdUserIds.push(user.id)

    const { token } = await authenticatePlatformUser({ email: user.email, password: PASSWORD, ip: uniqueIp() })
    expect(await resolveSession(db, token)).not.toBeNull()

    await logoutPlatformUser(token)

    expect(await resolveSession(db, token)).toBeNull()
  })
})
