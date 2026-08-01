import { router } from './trpc'
import { countriesRouter } from './routers/countries'
import { storageRouter } from './routers/storage'
import { regionsRouter } from "./routers/regions";

export const appRouter = router({
  countries: countriesRouter,
  storage: storageRouter,
  regions: regionsRouter
})

export type AppRouter = typeof appRouter
