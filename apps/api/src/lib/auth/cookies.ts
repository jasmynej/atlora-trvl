import { parse, serialize } from 'hono/utils/cookie'
import { SESSION_ABSOLUTE_TTL_MS } from './session'

// Path=/ with a distinctly named cookie, per §3 of the handoff — the
// simpler of the two documented options. The alternative (mounting under
// /platform/api/* so a Path=/platform cookie scope covers both UI and API)
// needs a proxy rule that doesn't exist yet; this cookie is httpOnly and
// only ever resolved by platformProcedure, so it being sent-but-ignored on
// agency/traveler routes is fine. Revisit if/when that mount point lands.
export const PLATFORM_SESSION_COOKIE = 'atlora_platform_session'

// localhost is a "potentially trustworthy origin", so `secure: true` cookies
// work in local dev over plain http://localhost — no NODE_ENV branch needed,
// which avoids the classic footgun of a dev-only flag surviving into prod.
const SESSION_COOKIE_MAX_AGE_SECONDS = Math.floor(SESSION_ABSOLUTE_TTL_MS / 1000)

export function readSessionCookie(cookieHeader: string | null, cookieName: string): string | null {
  if (!cookieHeader) return null
  return parse(cookieHeader)[cookieName] ?? null
}

export function serializeSessionCookie(cookieName: string, token: string): string {
  return serialize(cookieName, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  })
}

export function serializeExpiredCookie(cookieName: string): string {
  return serialize(cookieName, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 0,
  })
}
