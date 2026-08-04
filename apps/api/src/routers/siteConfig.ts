import { db, siteConfig } from '@atlora/db'
import { CreateSiteConfigSchema, UpdateSiteConfigSchema } from '@atlora/types'
import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const siteConfigRouter = router({
  list: publicProcedure.query(() => {
    return db.select().from(siteConfig).orderBy(asc(siteConfig.key))
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.id, input.id))
    return row ?? null
  }),

  getByKey: publicProcedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, input.key))
    return row ?? null
  }),

  create: publicProcedure.input(CreateSiteConfigSchema).mutation(async ({ input }) => {
    const [record] = await db.insert(siteConfig).values(input).returning()
    return record
  }),

  update: publicProcedure.input(UpdateSiteConfigSchema).mutation(async ({ input }) => {
    const { id, ...rest } = input
    const [record] = await db.update(siteConfig).set(rest).where(eq(siteConfig.id, id)).returning()
    return record
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const [record] = await db.delete(siteConfig).where(eq(siteConfig.id, input.id)).returning()
    return record
  }),
})
