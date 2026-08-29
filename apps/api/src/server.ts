import { serve } from '@hono/node-server'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appRouter } from './index'
import { createContext } from './trpc'

const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))

app.get('/', (c) => c.json({ status: 'ok' }))

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    // @hono/trpc-server's createContext type is a generic Record<string, unknown>
    // rather than our actual Context — cast at this one boundary.
    createContext: (opts) => createContext({ req: opts.req }) as unknown as Record<string, unknown>,
  })
)

serve({ fetch: app.fetch, port: 3001 }, () => {
  console.log('API running on http://localhost:3001')
})
