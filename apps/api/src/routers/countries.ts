import { countries, db } from '@atlora/db'
import { CreateCountrySchema, UpdateCountrySchema } from '@atlora/types'
import { asc, eq } from 'drizzle-orm'
import { publicProcedure, router } from '../trpc'
import { z } from 'zod'
export const countriesRouter = router({
  list: publicProcedure.query(() => {
    return db.select().from(countries).orderBy(asc(countries.name))
  }),
  byCode: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts
    const [country] = await db.select().from(countries).where(eq(countries.code, input))
    return country ?? null
  }),
  create: publicProcedure.input(CreateCountrySchema).mutation(async ({ input }) => {
    const [country] = await db.insert(countries).values(input).returning()
    return country
  }),
  update: publicProcedure.input(UpdateCountrySchema).mutation(async ({ input }) => {
    const { code, ...rest } = input
    const [country] = await db
      .update(countries)
      .set(rest)
      .where(eq(countries.code, code))
      .returning()
    return country
  }),
  delete: publicProcedure.input(z.object({ code: z.string() })).mutation(async ({ input }) => {
    const [country] = await db.delete(countries).where(eq(countries.code, input.code)).returning()
    return country
  }),
})
