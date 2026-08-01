import { db, regions } from '@atlora/db'
import { CreateRegionSchema } from '@atlora/types'
import { publicProcedure, router } from '../trpc'

export const regionsRouter = router({
  list: publicProcedure.query(() => {
    return db.select().from(regions)
  }),
  create: publicProcedure
    .input(CreateRegionSchema)
    .mutation(async ({ input }) => {
      const [region] = await db.insert(regions).values(input).returning()
      return region
    }),
})
