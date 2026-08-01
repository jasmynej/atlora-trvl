import { serve } from '@hono/node-server'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appRouter } from './index'

const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400,
}))

app.get('/', (c) => c.json({ status: 'ok' }))

app.use('/trpc/*', trpcServer({ router: appRouter }))

serve({ fetch: app.fetch, port: 3001 }, () => {
  console.log('API running on http://localhost:3001')
})
