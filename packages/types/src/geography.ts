import { z } from 'zod'

export const StatusSchema = z.enum(["DRAFT", "PUBLISHED"])
export const DestinationTypeSchema = z.enum([
  "city",
  "region_area",
  "island",
  "beach",
  "national_park",
  "other",
])
export const MonthSchema = z.enum([
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
])
export const PoiTypeSchema = z.enum([
  "hotel",
  "attraction",
  "restaurant",
  "aiport",
  "transport_hub",
  "neighborhood",
])

export const CountrySchema = z.object({
  code: z.string(),
  name: z.string(),
  flagSvg: z.string(),
  region: z.string(),
  subRegion: z.string(),
  borders: z.array(z.string()),
  capital: z.string(),
  capitalLat: z.number(),
  capitalLong: z.number(),
})

export const RegionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  heroImageUrl: z.string().nullable(),
  status: StatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  countries: z.array(CountrySchema).optional(),
})

export const CreateRegionSchema = RegionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  countries: true,
})

export const UpdateRegionSchema = CreateRegionSchema.partial()

export const PoiSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  type: PoiTypeSchema,
  destinationId: z.string(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  address: z.string().nullable(),
  summary: z.string().nullable(),
  website: z.string().nullable(),
})

export const CreatePoiSchema = PoiSchema.omit({ id: true })
export const UpdatePoiSchema = CreatePoiSchema.partial().extend({ id: z.string() })

export const DestinationSeasonSchema = z.object({
  destinationId: z.string(),
  month: MonthSchema,
  rating: z.string().nullable(),
  note: z.string().nullable(),
})

export const CreateDestinationSeasonSchema = DestinationSeasonSchema
export const UpdateDestinationSeasonSchema = DestinationSeasonSchema.partial({
  rating: true,
  note: true,
})

export type Destination = {
  id: string
  slug: string
  name: string
  type: z.infer<typeof DestinationTypeSchema>
  status: z.infer<typeof StatusSchema>
  tagline: string | null
  description: string | null
  heroImageUrl: string | null
  bestTimeToVisit: string | null
  countryCode: string | null
  parentId: string | null
  createdAt: string
  updatedAt: string
  country?: Country | null
  parent?: Destination | null
  children?: Destination[]
  pois?: Poi[]
  seasons?: DestinationSeason[]
}

const DestinationBaseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  type: DestinationTypeSchema,
  status: StatusSchema,
  tagline: z.string().nullable(),
  description: z.string().nullable(),
  heroImageUrl: z.string().nullable(),
  bestTimeToVisit: z.string().nullable(),
  countryCode: z.string().nullable(),
  parentId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const DestinationSchema: z.ZodType<Destination> = DestinationBaseSchema.extend({
  country: CountrySchema.nullable().optional(),
  parent: z.lazy(() => DestinationSchema).nullable().optional(),
  children: z.array(z.lazy(() => DestinationSchema)).optional(),
  pois: z.array(PoiSchema).optional(),
  seasons: z.array(DestinationSeasonSchema).optional(),
})

export const CreateDestinationSchema = DestinationBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateDestinationSchema = CreateDestinationSchema.partial().extend({
  id: z.string(),
})

export type Country = z.infer<typeof CountrySchema>
export type Region = z.infer<typeof RegionSchema>
export type CreateRegion = z.infer<typeof CreateRegionSchema>
export type UpdateRegion = z.infer<typeof UpdateRegionSchema>
export type CreateDestination = z.infer<typeof CreateDestinationSchema>
export type UpdateDestination = z.infer<typeof UpdateDestinationSchema>
export type Poi = z.infer<typeof PoiSchema>
export type CreatePoi = z.infer<typeof CreatePoiSchema>
export type UpdatePoi = z.infer<typeof UpdatePoiSchema>
export type DestinationSeason = z.infer<typeof DestinationSeasonSchema>
export type CreateDestinationSeason = z.infer<typeof CreateDestinationSeasonSchema>
export type UpdateDestinationSeason = z.infer<typeof UpdateDestinationSeasonSchema>
