import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { PLATFORM_SESSION_COOKIE, readSessionCookie, serializeExpiredCookie, serializeSessionCookie } from '../lib/auth/cookies'
import { AuthError, authenticatePlatformUser, logoutPlatformUser } from '../lib/auth/platformAuth'
import { platformProcedure, publicProcedure, router } from '../trpc'

const AUTH_ERROR_TO_TRPC_CODE = {
  RATE_LIMITED: 'TOO_MANY_REQUESTS',
  LOCKED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'UNAUTHORIZED',
  INACTIVE: 'UNAUTHORIZED',
} as const

export const platformAuthRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { user, token } = await authenticatePlatformUser({
          email: input.email,
          password: input.password,
          ip: ctx.ip,
          userAgent: ctx.userAgent,
        })

        ctx.resHeaders.append('set-cookie', serializeSessionCookie(PLATFORM_SESSION_COOKIE, token))

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      } catch (err) {
        if (err instanceof AuthError) {
          throw new TRPCError({ code: AUTH_ERROR_TO_TRPC_CODE[err.code], message: err.message })
        }
        throw err
      }
    }),

  // Idempotent and unauthenticated on purpose: an expired-but-cookie-still-
  // present session should still be able to clear its cookie, not get
  // rejected by the same guard it's trying to escape.
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const token = readSessionCookie(ctx.req.headers.get('cookie'), PLATFORM_SESSION_COOKIE)
    if (token) {
      await logoutPlatformUser(token)
    }
    ctx.resHeaders.append('set-cookie', serializeExpiredCookie(PLATFORM_SESSION_COOKIE))
    return { ok: true }
  }),

  me: platformProcedure.query(({ ctx }) => {
    const { id, email, name, role } = ctx.platformUser
    return { id, email, name, role }
  }),
})
