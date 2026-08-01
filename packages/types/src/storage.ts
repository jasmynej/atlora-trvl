import { z } from 'zod'

export const GetUploadUrlSchema = z.object({
  key: z.string().min(1),
  contentType: z.string().min(1),
})

export const UploadUrlResponseSchema = z.object({
  uploadUrl: z.string().url(),
  publicUrl: z.string().url(),
  key: z.string(),
})

export type GetUploadUrl = z.infer<typeof GetUploadUrlSchema>
export type UploadUrlResponse = z.infer<typeof UploadUrlResponseSchema>
