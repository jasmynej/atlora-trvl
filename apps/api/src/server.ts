import { serve } from '@hono/node-server'
import type { HttpBindings } from '@hono/node-server'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appRouter } from './index'

const app = new Hono<{ Bindings: HttpBindings }>()

app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  // Platform auth is cookie-based, so the browser must be told it's allowed
  // to send/receive cookies on cross-origin requests from apps/admin.
  credentials: true,
  maxAge: 86400,
}))

app.get('/', (c) => c.json({ status: 'ok' }))

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (opts, c) => ({
      req: opts.req,
      resHeaders: opts.resHeaders,
      ip: c.req.header('x-forwarded-for') ?? c.env.incoming.socket.remoteAddress ?? null,
      userAgent: c.req.header('user-agent') ?? null,
    }),
  })
)

serve({ fetch: app.fetch, port: 3001 }, () => {
  console.log('API running on http://localhost:3001')
})
