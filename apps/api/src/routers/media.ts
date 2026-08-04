import { db, media, mediaAttachments } from '@atlora/db'
import {
  CreateMediaAttachmentSchema,
  CreateMediaSchema,
  DetachMediaInputSchema,
  SetHeroMediaInputSchema,
  UpdateMediaSchema,
} from '@atlora/types'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { r2, R2_BUCKET } from '../lib/r2'
import { replaceHeroSafe } from '../lib/mediaAttachments'
import { publicProcedure, router } from '../trpc'

export const mediaRouter = router({
  list: publicProcedure.query(() => {
    return db.query.media.findMany()
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return db.query.media.findFirst({ where: { id: input.id }, with: { attachments: true } })
  }),

  create: publicProcedure.input(CreateMediaSchema).mutation(async ({ input }) => {
    const [record] = await db.insert(media).values(input).returning()
    return record
  }),

  update: publicProcedure.input(UpdateMediaSchema).mutation(async ({ input }) => {
    const { id, ...rest } = input
    const [record] = await db.update(media).set(rest).where(eq(media.id, id)).returning()
    return record
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const deleted = await db.transaction(async (tx) => {
      const existing = await tx.query.media.findFirst({ where: { id: input.id } })
      if (!existing) return null
      await tx.delete(media).where(eq(media.id, input.id))
      return existing
    })

    if (deleted) {
      await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: deleted.key }))
    }

    return deleted
  }),

  attach: publicProcedure.input(CreateMediaAttachmentSchema).mutation(async ({ input }) => {
    const { entityType, entityId, ...rest } = input
    const [attachment] = await replaceHeroSafe(db, entityType, entityId, [rest])
    return attachment
  }),

  detach: publicProcedure.input(DetachMediaInputSchema).mutation(({ input }) => {
    return db.delete(mediaAttachments).where(eq(mediaAttachments.id, input.id)).returning()
  }),

  setHero: publicProcedure.input(SetHeroMediaInputSchema).mutation(async ({ input }) => {
    const { entityType, entityId, mediaId, sortOrder } = input
    const [attachment] = await replaceHeroSafe(db, entityType, entityId, [
      { mediaId, role: 'hero', sortOrder: sortOrder ?? 0 },
    ])
    return attachment
  }),
})
