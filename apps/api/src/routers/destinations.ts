import {
  db,
  destinationSeason,
  destinations,
  destinationsToRegions,
  mediaAttachments,
  poi,
} from '@atlora/db'
import {
  AddRegionToDestinationSchema,
  CreateDestinationWithRelationsSchema,
  DestinationSeasonSchema,
  RemoveRegionFromDestinationSchema,
  RemoveSeasonInputSchema,
  UpdateDestinationWithRelationsSchema,
} from '@atlora/types'
import { and, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { replaceHeroSafe } from '../lib/mediaAttachments'
import { publicProcedure, router } from '../trpc'

const fullWith = {
  country: true,
  parent: true,
  children: true,
  pois: { with: { media: { with: { media: true } } } },
  seasons: true,
  media: { with: { media: true } },
  regions: true,
} as const

const listColumns = {
  id: true,
  slug: true,
  name: true,
  type: true,
  status: true,
  tagline: true,
  description: true,
  bestTimeToVisit: true,
  countryCode: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
} as const

export const destinationsRouter = router({
  list: publicProcedure.query(() => {
    return db.query.destinations.findMany({
      columns: listColumns,
      with: {
        media: { where: { role: 'hero' }, limit: 1, with: { media: true } },
      },
    })
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return db.query.destinations.findFirst({ where: { id: input.id }, with: fullWith })
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => {
    return db.query.destinations.findFirst({ where: { slug: input.slug }, with: fullWith })
  }),

  create: publicProcedure
    .input(CreateDestinationWithRelationsSchema)
    .mutation(async ({ input }) => {
      const { seasons, media, regionIds, ...core } = input

      return db.transaction(async (tx) => {
        const [destination] = await tx.insert(destinations).values(core).returning()
        const destinationId = destination!.id

        if (seasons && seasons.length > 0) {
          await tx
            .insert(destinationSeason)
            .values(seasons.map((s) => ({ ...s, destinationId })))
        }
        if (media && media.length > 0) {
          await replaceHeroSafe(tx, 'destination', destinationId, media)
        }
        if (regionIds && regionIds.length > 0) {
          await tx
            .insert(destinationsToRegions)
            .values(regionIds.map((regionId) => ({ destinationId, regionId })))
        }

        return tx.query.destinations.findFirst({ where: { id: destinationId }, with: fullWith })
      })
    }),

  update: publicProcedure
    .input(UpdateDestinationWithRelationsSchema)
    .mutation(async ({ input }) => {
      const { id, seasons, media, regionIds, ...core } = input

      return db.transaction(async (tx) => {
        if (Object.keys(core).length > 0) {
          await tx.update(destinations).set(core).where(eq(destinations.id, id))
        }

        if (seasons !== undefined) {
          await tx.delete(destinationSeason).where(eq(destinationSeason.destinationId, id))
          if (seasons.length > 0) {
            await tx
              .insert(destinationSeason)
              .values(seasons.map((s) => ({ ...s, destinationId: id })))
          }
        }

        if (media !== undefined) {
          await tx
            .delete(mediaAttachments)
            .where(
              and(eq(mediaAttachments.entityType, 'destination'), eq(mediaAttachments.entityId, id))
            )
          if (media.length > 0) {
            await replaceHeroSafe(tx, 'destination', id, media)
          }
        }

        if (regionIds !== undefined) {
          await tx.delete(destinationsToRegions).where(eq(destinationsToRegions.destinationId, id))
          if (regionIds.length > 0) {
            await tx
              .insert(destinationsToRegions)
              .values(regionIds.map((regionId) => ({ destinationId: id, regionId })))
          }
        }

        return tx.query.destinations.findFirst({ where: { id }, with: fullWith })
      })
    }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    return db.transaction(async (tx) => {
      const childPois = await tx
        .select({ id: poi.id })
        .from(poi)
        .where(eq(poi.destinationId, input.id))

      if (childPois.length > 0) {
        await tx
          .delete(mediaAttachments)
          .where(
            and(
              eq(mediaAttachments.entityType, 'poi'),
              inArray(
                mediaAttachments.entityId,
                childPois.map((p) => p.id)
              )
            )
          )
      }

      await tx
        .delete(mediaAttachments)
        .where(
          and(eq(mediaAttachments.entityType, 'destination'), eq(mediaAttachments.entityId, input.id))
        )

      // poi, destinationSeason, destinationsToRegions all cascade via FK.
      const [deleted] = await tx.delete(destinations).where(eq(destinations.id, input.id)).returning()
      return deleted
    })
  }),

  addSeason: publicProcedure.input(DestinationSeasonSchema).mutation(({ input }) => {
    return db.insert(destinationSeason).values(input).returning()
  }),

  removeSeason: publicProcedure.input(RemoveSeasonInputSchema).mutation(({ input }) => {
    return db
      .delete(destinationSeason)
      .where(
        and(
          eq(destinationSeason.destinationId, input.destinationId),
          eq(destinationSeason.month, input.month)
        )
      )
      .returning()
  }),

  addRegion: publicProcedure.input(AddRegionToDestinationSchema).mutation(({ input }) => {
    return db.insert(destinationsToRegions).values(input).returning()
  }),

  removeRegion: publicProcedure.input(RemoveRegionFromDestinationSchema).mutation(({ input }) => {
    return db
      .delete(destinationsToRegions)
      .where(
        and(
          eq(destinationsToRegions.destinationId, input.destinationId),
          eq(destinationsToRegions.regionId, input.regionId)
        )
      )
      .returning()
  }),
})
