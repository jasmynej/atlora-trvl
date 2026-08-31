import { createHash, randomBytes } from 'node:crypto'

// 32 bytes from a CSPRNG, per §3 of the platform admin handoff. The raw
// token is the bearer credential (goes in the cookie); only its hash is
// ever persisted, so a DB read can't recover a usable session token.
export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
