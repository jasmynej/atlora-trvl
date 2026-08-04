import { db, mediaAttachments, poi } from '@atlora/db'
import { CreatePoiWithRelationsSchema, UpdatePoiWithRelationsSchema } from '@atlora/types'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { replaceHeroSafe } from '../lib/mediaAttachments'
import { publicProcedure, router } from '../trpc'

const fullWith = {
  destination: true,
  media: { with: { media: true } },
} as const

const listColumns = {
  id: true,
  slug: true,
  name: true,
  type: true,
  destinationId: true,
  lat: true,
  lng: true,
  address: true,
  summary: true,
  website: true,
} as const

export const poiRouter = router({
  list: publicProcedure.query(() => {
    return db.query.poi.findMany({
      columns: listColumns,
      with: {
        media: { where: { role: 'hero' }, limit: 1, with: { media: true } },
      },
    })
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return db.query.poi.findFirst({ where: { id: input.id }, with: fullWith })
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => {
    return db.query.poi.findFirst({ where: { slug: input.slug }, with: fullWith })
  }),

  create: publicProcedure.input(CreatePoiWithRelationsSchema).mutation(async ({ input }) => {
    const { media, ...core } = input

    return db.transaction(async (tx) => {
      const [created] = await tx.insert(poi).values(core).returning()
      const poiId = created!.id

      if (media && media.length > 0) {
        await replaceHeroSafe(tx, 'poi', poiId, media)
      }

      return tx.query.poi.findFirst({ where: { id: poiId }, with: fullWith })
    })
  }),

  update: publicProcedure.input(UpdatePoiWithRelationsSchema).mutation(async ({ input }) => {
    const { id, media, ...core } = input

    return db.transaction(async (tx) => {
      if (Object.keys(core).length > 0) {
        await tx.update(poi).set(core).where(eq(poi.id, id))
      }

      if (media !== undefined) {
        await tx
          .delete(mediaAttachments)
          .where(and(eq(mediaAttachments.entityType, 'poi'), eq(mediaAttachments.entityId, id)))
        if (media.length > 0) {
          await replaceHeroSafe(tx, 'poi', id, media)
        }
      }

      return tx.query.poi.findFirst({ where: { id }, with: fullWith })
    })
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    return db.transaction(async (tx) => {
      await tx
        .delete(mediaAttachments)
        .where(and(eq(mediaAttachments.entityType, 'poi'), eq(mediaAttachments.entityId, input.id)))
      const [deleted] = await tx.delete(poi).where(eq(poi.id, input.id)).returning()
      return deleted
    })
  }),
})
