// Fixture data dumped from the real, seeded local database — see
// `packages/db/src/seedGeography.ts`. Shapes match exactly what the
// corresponding `apps/api` tRPC procedure returns (see the file name).
// Storybook-only: not exported from the package's public entry point.
import type { Country, Destination, Poi, Region } from '@atlora/types'

import countriesListJson from './countries.list.json'
import regionsListJson from './regions.list.json'
import regionSoutheastAsiaJson from './regions.getBySlug.southeast-asia.json'
import destinationsListJson from './destinations.list.json'
import destinationBaliJson from './destinations.getBySlug.bali.json'
import destinationNegrilJson from './destinations.getBySlug.negril.json'
import poiListJson from './poi.list.json'
import poiUluwatuTempleJson from './poi.getBySlug.bali-uluwatu-temple.json'
import poiPotatoHeadJson from './poi.getBySlug.bali-potato-head-beach-club.json'

/** `countries.list` — all 250 seeded countries, ordered by name. */
export const countriesList = countriesListJson as Country[]

/** `regions.list` — summary view (hero image only, no nested countries/destinations). */
export const regionsList = regionsListJson as Region[]

/** `regions.getBySlug("southeast-asia")` — full detail: countries, destinations, media. */
export const regionSoutheastAsia = regionSoutheastAsiaJson as Region

/** `destinations.list` — summary view (hero image only). */
export const destinationsList = destinationsListJson as Destination[]

/** `destinations.getBySlug("bali")` — richest example: country, POIs (with media), gallery, regions. PUBLISHED. */
export const destinationBali = destinationBaliJson as Destination

/** `destinations.getBySlug("negril")` — simpler example: no POIs, no gallery. DRAFT status. */
export const destinationNegril = destinationNegrilJson as Destination

/** `poi.list` — summary view (hero image only). */
export const poiList = poiListJson as Poi[]

/** `poi.getBySlug("bali-uluwatu-temple")` — full detail, has a hero image. */
export const poiUluwatuTemple = poiUluwatuTempleJson as Poi

/** `poi.getBySlug("bali-potato-head-beach-club")` — full detail, no media (covers the empty-image state). */
export const poiPotatoHeadBeachClub = poiPotatoHeadJson as Poi
