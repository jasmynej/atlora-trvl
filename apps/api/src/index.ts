import { router } from './trpc'
import { countriesRouter } from './routers/countries'
import { storageRouter } from './routers/storage'
import { regionsRouter } from "./routers/regions";
import { destinationsRouter } from "./routers/destinations";
import { poiRouter } from "./routers/poi";
import { mediaRouter } from "./routers/media";
import { siteConfigRouter } from "./routers/siteConfig";
import { platformAuthRouter } from './routers/platformAuth'

const platformRouter = router({
  auth: platformAuthRouter,
})

export const appRouter = router({
  countries: countriesRouter,
  storage: storageRouter,
  regions: regionsRouter,
  destinations: destinationsRouter,
  poi: poiRouter,
  media: mediaRouter,
  siteConfig: siteConfigRouter,
  platform: platformRouter,
})

export type AppRouter = typeof appRouter
