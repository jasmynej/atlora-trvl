import { GetUploadUrlSchema } from '@atlora/types'
import { z } from 'zod'
import { storage } from '../lib/storage'
import { publicProcedure, router } from '../trpc'

const UPLOAD_URL_EXPIRY_SECONDS = 300

export const storageRouter = router({
  getUploadUrl: publicProcedure
    .input(GetUploadUrlSchema)
    .mutation(async ({ input }) => {
      const uploadUrl = await storage.getSignedUploadUrl(
        input.key,
        input.contentType,
        UPLOAD_URL_EXPIRY_SECONDS
      )
      return {
        uploadUrl,
        publicUrl: storage.getPublicUrl(input.key),
        key: input.key,
      }
    }),

  deleteObject: publicProcedure
    .input(z.object({ key: z.string().min(1) }))
    .mutation(({ input }) => storage.deleteObject(input.key)),
})
