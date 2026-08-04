import { z } from 'zod'
import { AttachMediaInputSchema, MediaAttachmentSchema, type MediaAttachment } from './media'

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

export const CreateCountrySchema = CountrySchema
export const UpdateCountrySchema = CountrySchema.partial().extend({ code: z.string() })

export const RegionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  status: StatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  countries: z.array(CountrySchema).optional(),
  media: z.array(MediaAttachmentSchema).optional(),
})

export const CreateRegionSchema = RegionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  countries: true,
  media: true,
})

export const UpdateRegionSchema = CreateRegionSchema.partial().extend({ id: z.string() })

// "With relations" variants: create/update a region together with its
// nested media attachments and country tags in one call. A nested array
// that is present (including []) fully replaces the existing set; an
// omitted field leaves that collection untouched (only relevant on update).
export const CreateRegionWithRelationsSchema = CreateRegionSchema.extend({
  media: z.array(AttachMediaInputSchema).optional(),
  countryCodes: z.array(z.string()).optional(),
})

export const UpdateRegionWithRelationsSchema = UpdateRegionSchema.extend({
  media: z.array(AttachMediaInputSchema).optional(),
  countryCodes: z.array(z.string()).optional(),
})

export const AddCountryToRegionSchema = z.object({
  regionId: z.string(),
  countryCode: z.string(),
})
export const RemoveCountryFromRegionSchema = AddCountryToRegionSchema

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

export const CreatePoiWithRelationsSchema = CreatePoiSchema.extend({
  media: z.array(AttachMediaInputSchema).optional(),
})

export const UpdatePoiWithRelationsSchema = UpdatePoiSchema.extend({
  media: z.array(AttachMediaInputSchema).optional(),
})

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
export const RemoveSeasonInputSchema = z.object({
  destinationId: z.string(),
  month: MonthSchema,
})

// Child shape for embedding seasons in a destination create/update payload —
// destinationId is supplied by the router from context, not the caller.
export const CreateDestinationSeasonInputSchema = DestinationSeasonSchema.omit({
  destinationId: true,
})

export type Destination = {
  id: string
  slug: string
  name: string
  type: z.infer<typeof DestinationTypeSchema>
  status: z.infer<typeof StatusSchema>
  tagline: string | null
  description: string | null
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
  media?: MediaAttachment[]
}

const DestinationBaseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  type: DestinationTypeSchema,
  status: StatusSchema,
  tagline: z.string().nullable(),
  description: z.string().nullable(),
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
  media: z.array(MediaAttachmentSchema).optional(),
})

export const CreateDestinationSchema = DestinationBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateDestinationSchema = CreateDestinationSchema.partial().extend({
  id: z.string(),
})

export const CreateDestinationWithRelationsSchema = CreateDestinationSchema.extend({
  seasons: z.array(CreateDestinationSeasonInputSchema).optional(),
  media: z.array(AttachMediaInputSchema).optional(),
  regionIds: z.array(z.string()).optional(),
})

export const UpdateDestinationWithRelationsSchema = UpdateDestinationSchema.extend({
  seasons: z.array(CreateDestinationSeasonInputSchema).optional(),
  media: z.array(AttachMediaInputSchema).optional(),
  regionIds: z.array(z.string()).optional(),
})

export const AddRegionToDestinationSchema = z.object({
  destinationId: z.string(),
  regionId: z.string(),
})
export const RemoveRegionFromDestinationSchema = AddRegionToDestinationSchema

export type Country = z.infer<typeof CountrySchema>
export type CreateCountry = z.infer<typeof CreateCountrySchema>
export type UpdateCountry = z.infer<typeof UpdateCountrySchema>
export type Region = z.infer<typeof RegionSchema>
export type CreateRegion = z.infer<typeof CreateRegionSchema>
export type UpdateRegion = z.infer<typeof UpdateRegionSchema>
export type CreateRegionWithRelations = z.infer<typeof CreateRegionWithRelationsSchema>
export type UpdateRegionWithRelations = z.infer<typeof UpdateRegionWithRelationsSchema>
export type AddCountryToRegion = z.infer<typeof AddCountryToRegionSchema>
export type RemoveCountryFromRegion = z.infer<typeof RemoveCountryFromRegionSchema>
export type CreateDestination = z.infer<typeof CreateDestinationSchema>
export type UpdateDestination = z.infer<typeof UpdateDestinationSchema>
export type CreateDestinationWithRelations = z.infer<typeof CreateDestinationWithRelationsSchema>
export type UpdateDestinationWithRelations = z.infer<typeof UpdateDestinationWithRelationsSchema>
export type AddRegionToDestination = z.infer<typeof AddRegionToDestinationSchema>
export type RemoveRegionFromDestination = z.infer<typeof RemoveRegionFromDestinationSchema>
export type Poi = z.infer<typeof PoiSchema>
export type CreatePoi = z.infer<typeof CreatePoiSchema>
export type UpdatePoi = z.infer<typeof UpdatePoiSchema>
export type CreatePoiWithRelations = z.infer<typeof CreatePoiWithRelationsSchema>
export type UpdatePoiWithRelations = z.infer<typeof UpdatePoiWithRelationsSchema>
export type DestinationSeason = z.infer<typeof DestinationSeasonSchema>
export type CreateDestinationSeason = z.infer<typeof CreateDestinationSeasonSchema>
export type UpdateDestinationSeason = z.infer<typeof UpdateDestinationSeasonSchema>
export type RemoveSeasonInput = z.infer<typeof RemoveSeasonInputSchema>
export type CreateDestinationSeasonInput = z.infer<typeof CreateDestinationSeasonInputSchema>
