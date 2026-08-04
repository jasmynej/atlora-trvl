import { router } from './trpc'
import { countriesRouter } from './routers/countries'
import { storageRouter } from './routers/storage'
import { regionsRouter } from "./routers/regions";
import { destinationsRouter } from "./routers/destinations";
import { poiRouter } from "./routers/poi";
import { mediaRouter } from "./routers/media";
import { siteConfigRouter } from "./routers/siteConfig";

export const appRouter = router({
  countries: countriesRouter,
  storage: storageRouter,
  regions: regionsRouter,
  destinations: destinationsRouter,
  poi: poiRouter,
  media: mediaRouter,
  siteConfig: siteConfigRouter
})

export type AppRouter = typeof appRouter
