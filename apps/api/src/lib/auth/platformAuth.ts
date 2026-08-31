import { db, platformUsers } from '@atlora/db'
import { eq } from 'drizzle-orm'
import { checkRateLimit } from './rateLimit'
import { hashPassword, verifyPassword } from './password'
import { createSession, revokeSession } from './session'

const LOGIN_LOCKOUT_THRESHOLD = 5
const LOGIN_LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes
const LOGIN_RATE_LIMIT = { windowMs: 5 * 60 * 1000, max: 10 } // per IP, per email

export type AuthErrorCode = 'RATE_LIMITED' | 'LOCKED' | 'INVALID_CREDENTIALS' | 'INACTIVE'

export class AuthError extends Error {
  code: AuthErrorCode
  constructor(code: AuthErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export interface AuthenticateInput {
  email: string
  password: string
  ip?: string | null
  userAgent?: string | null
}

/**
 * The platform-specific half of "authenticate" from the handoff's narrow
 * auth interface (createSession/resolveSession/revokeSession are fully
 * generic — see ./session.ts). Credential lookup is necessarily per-subject
 * since platform, agency, and traveler accounts live in different tables;
 * this is the platform composition. An analogous authenticateAgencyUser
 * would follow the same shape against agency_users in Milestone 3.
 */
export async function authenticatePlatformUser(
  input: AuthenticateInput
): Promise<{ user: typeof platformUsers.$inferSelect; token: string }> {
  const email = normalizeEmail(input.email)

  const ipKey = `platform-login:ip:${input.ip ?? 'unknown'}`
  const emailKey = `platform-login:email:${email}`
  const ipOk = checkRateLimit(ipKey, LOGIN_RATE_LIMIT)
  const emailOk = checkRateLimit(emailKey, LOGIN_RATE_LIMIT)
  if (!ipOk || !emailOk) {
    throw new AuthError('RATE_LIMITED', 'Too many login attempts. Try again later.')
  }

  const user = await db.query.platformUsers.findFirst({ where: { email } })
  if (!user) {
    // No row to fail against — still rate-limited above, which is the
    // meaningful defense against enumeration via timing/volume.
    throw new AuthError('INVALID_CREDENTIALS', 'Incorrect email or password.')
  }

  const now = new Date()
  if (user.lockedUntil && user.lockedUntil > now) {
    throw new AuthError('LOCKED', 'This account is temporarily locked. Try again later.')
  }

  const valid = await verifyPassword(user.passwordHash, input.password)
  if (!valid) {
    const failedLoginCount = user.failedLoginCount + 1
    const lockingNow = failedLoginCount >= LOGIN_LOCKOUT_THRESHOLD
    await db
      .update(platformUsers)
      .set({
        failedLoginCount: lockingNow ? 0 : failedLoginCount,
        lockedUntil: lockingNow ? new Date(now.getTime() + LOGIN_LOCKOUT_DURATION_MS) : user.lockedUntil,
      })
      .where(eq(platformUsers.id, user.id))

    throw new AuthError(
      lockingNow ? 'LOCKED' : 'INVALID_CREDENTIALS',
      lockingNow ? 'This account is temporarily locked. Try again later.' : 'Incorrect email or password.'
    )
  }

  if (user.status !== 'active') {
    throw new AuthError('INACTIVE', 'This account is not active.')
  }

  await db
    .update(platformUsers)
    .set({ failedLoginCount: 0, lockedUntil: null, lastLoginAt: now })
    .where(eq(platformUsers.id, user.id))

  const { token } = await createSession(db, {
    subjectType: 'platform',
    subjectId: user.id,
    ip: input.ip,
    userAgent: input.userAgent,
  })

  return { user, token }
}

export async function logoutPlatformUser(token: string): Promise<void> {
  await revokeSession(db, token)
}

/** Used only by the seed/CLI command — see src/cli/*.ts. Never by a route. */
export function hashPlatformPassword(password: string): Promise<string> {
  return hashPassword(password)
}

export { normalizeEmail as normalizePlatformEmail }
