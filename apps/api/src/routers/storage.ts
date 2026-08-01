import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetUploadUrlSchema } from '@atlora/types'
import { z } from 'zod'
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '../lib/r2'
import { publicProcedure, router } from '../trpc'

export const storageRouter = router({
  getUploadUrl: publicProcedure
    .input(GetUploadUrlSchema)
    .mutation(async ({ input }) => {
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: input.key,
        ContentType: input.contentType,
      })
      const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 })
      return {
        uploadUrl,
        publicUrl: `${R2_PUBLIC_URL}/${input.key}`,
        key: input.key,
      }
    }),

  deleteObject: publicProcedure
    .input(z.object({ key: z.string().min(1) }))
    .mutation(({ input }) =>
      r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: input.key }))
    ),
})
