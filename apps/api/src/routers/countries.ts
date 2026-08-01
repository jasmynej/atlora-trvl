import { countries, db } from '@atlora/db'
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
  })
})
