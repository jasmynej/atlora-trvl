import { countriesToRegions, db, mediaAttachments, regions } from '@atlora/db'
import {
  AddCountryToRegionSchema,
  CreateRegionWithRelationsSchema,
  RemoveCountryFromRegionSchema,
  UpdateRegionWithRelationsSchema,
} from '@atlora/types'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { replaceHeroSafe } from '../lib/mediaAttachments'
import { publicProcedure, router } from '../trpc'

const fullWith = {
  countries: true,
  destinations: true,
  media: { with: { media: true } },
} as const

export const regionsRouter = router({
  list: publicProcedure.query(() => {
    return db.query.regions.findMany({
      columns: {
        id: true,
        slug: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        media: { where: { role: 'hero' }, limit: 1, with: { media: true } },
      },
    })
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return db.query.regions.findFirst({ where: { id: input.id }, with: fullWith })
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => {
    return db.query.regions.findFirst({ where: { slug: input.slug }, with: fullWith })
  }),

  create: publicProcedure
    .input(CreateRegionWithRelationsSchema)
    .mutation(async ({ input }) => {
      const { media, countryCodes, ...core } = input

      return db.transaction(async (tx) => {
        const [region] = await tx.insert(regions).values(core).returning()
        const regionId = region!.id

        if (media && media.length > 0) {
          await replaceHeroSafe(tx, 'region', regionId, media)
        }
        if (countryCodes && countryCodes.length > 0) {
          await tx
            .insert(countriesToRegions)
            .values(countryCodes.map((countryCode) => ({ countryCode, regionId })))
        }

        return tx.query.regions.findFirst({ where: { id: regionId }, with: fullWith })
      })
    }),

  update: publicProcedure
    .input(UpdateRegionWithRelationsSchema)
    .mutation(async ({ input }) => {
      const { id, media, countryCodes, ...core } = input

      return db.transaction(async (tx) => {
        if (Object.keys(core).length > 0) {
          await tx.update(regions).set(core).where(eq(regions.id, id))
        }

        if (media !== undefined) {
          await tx
            .delete(mediaAttachments)
            .where(and(eq(mediaAttachments.entityType, 'region'), eq(mediaAttachments.entityId, id)))
          if (media.length > 0) {
            await replaceHeroSafe(tx, 'region', id, media)
          }
        }

        if (countryCodes !== undefined) {
          await tx.delete(countriesToRegions).where(eq(countriesToRegions.regionId, id))
          if (countryCodes.length > 0) {
            await tx
              .insert(countriesToRegions)
              .values(countryCodes.map((countryCode) => ({ countryCode, regionId: id })))
          }
        }

        return tx.query.regions.findFirst({ where: { id }, with: fullWith })
      })
    }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    return db.transaction(async (tx) => {
      await tx
        .delete(mediaAttachments)
        .where(and(eq(mediaAttachments.entityType, 'region'), eq(mediaAttachments.entityId, input.id)))
      const [deleted] = await tx.delete(regions).where(eq(regions.id, input.id)).returning()
      return deleted
    })
  }),

  addCountry: publicProcedure.input(AddCountryToRegionSchema).mutation(({ input }) => {
    return db.insert(countriesToRegions).values(input).returning()
  }),

  removeCountry: publicProcedure.input(RemoveCountryFromRegionSchema).mutation(({ input }) => {
    return db
      .delete(countriesToRegions)
      .where(
        and(
          eq(countriesToRegions.regionId, input.regionId),
          eq(countriesToRegions.countryCode, input.countryCode)
        )
      )
      .returning()
  }),
})
