import { db, sessions, type SubjectType } from '@atlora/db'
import { and, eq, gt, isNull } from 'drizzle-orm'
import { generateSessionToken, hashSessionToken } from './tokens'

// Absolute expiry, plus a separate idle timeout — both checked in
// resolveSession. Neither is extended by activity beyond touching
// last_used_at; the absolute cap is a hard ceiling per §3 of the handoff.
export const SESSION_ABSOLUTE_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours
export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]
type DbOrTx = typeof db | Tx

export type Session = typeof sessions.$inferSelect

export interface CreateSessionInput {
  subjectType: SubjectType
  subjectId: string
  ip?: string | null
  userAgent?: string | null
}

/**
 * Fully generic across subject types — reused as-is for agency and
 * traveler auth once those land. Callers key the resulting token to a
 * subject-specific cookie name; this module has no opinion on cookies.
 */
export async function createSession(
  dbOrTx: DbOrTx,
  input: CreateSessionInput
): Promise<{ token: string; session: Session }> {
  const token = generateSessionToken()
  const tokenHash = hashSessionToken(token)
  const now = new Date()

  const [session] = await dbOrTx
    .insert(sessions)
    .values({
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      tokenHash,
      createdAt: now,
      lastUsedAt: now,
      expiresAt: new Date(now.getTime() + SESSION_ABSOLUTE_TTL_MS),
      ip: input.ip ?? null,
      userAgent: input.userAgent ?? null,
    })
    .returning()

  return { token, session: session! }
}

/**
 * Resolves a raw token to its session row, or null if it doesn't exist, is
 * revoked, has passed its absolute expiry, or has been idle too long.
 *
 * Deliberately does NOT filter or assert on subject_type — that's the
 * caller's job (see platformProcedure in ../../trpc.ts). Collapsing "wrong
 * subject type" into this lookup would make a cross-subject token-confusion
 * attempt look identical to "no session", which is exactly the failure mode
 * §3 of the handoff calls out ("not as a side effect of a null lookup").
 */
export async function resolveSession(dbOrTx: DbOrTx, token: string): Promise<Session | null> {
  const tokenHash = hashSessionToken(token)
  const now = new Date()

  const [session] = await dbOrTx
    .select()
    .from(sessions)
    .where(
      and(eq(sessions.tokenHash, tokenHash), isNull(sessions.revokedAt), gt(sessions.expiresAt, now))
    )
    .limit(1)

  if (!session) return null

  const idleSince = now.getTime() - session.lastUsedAt.getTime()
  if (idleSince > SESSION_IDLE_TIMEOUT_MS) return null

  await dbOrTx.update(sessions).set({ lastUsedAt: now }).where(eq(sessions.id, session.id))

  return session
}

/** Revokes the session identified by its raw token. No-op if not found. */
export async function revokeSession(dbOrTx: DbOrTx, token: string): Promise<void> {
  const tokenHash = hashSessionToken(token)
  await dbOrTx.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.tokenHash, tokenHash))
}
