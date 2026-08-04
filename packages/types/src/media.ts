import { z } from 'zod'

export const MediaEntityTypeSchema = z.enum(["region", "destination", "poi"])
export const MediaRoleSchema = z.enum(["hero", "gallery"])

export const MediaSchema = z.object({
  id: z.string(),
  key: z.string(),
  url: z.string().url(),
  altText: z.string().nullable(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  mimeType: z.string().nullable(),
  createdAt: z.string(),
})

export const CreateMediaSchema = MediaSchema.omit({ id: true, createdAt: true })
export const UpdateMediaSchema = CreateMediaSchema.partial().extend({ id: z.string() })

export const MediaAttachmentSchema = z.object({
  id: z.string(),
  mediaId: z.string(),
  entityType: MediaEntityTypeSchema,
  entityId: z.string(),
  role: MediaRoleSchema,
  sortOrder: z.number().int(),
  createdAt: z.string(),
  media: MediaSchema.optional(),
})

export const CreateMediaAttachmentSchema = MediaAttachmentSchema.omit({
  id: true,
  createdAt: true,
  media: true,
})

export const UpdateMediaAttachmentSchema = CreateMediaAttachmentSchema.partial().extend({
  id: z.string(),
})

// Child shape for embedding attachments in a parent (region/destination/poi)
// create/update payload — entityType/entityId are supplied by the router from
// context, not the caller.
export const AttachMediaInputSchema = CreateMediaAttachmentSchema.omit({
  entityType: true,
  entityId: true,
})

export const SetHeroMediaInputSchema = z.object({
  entityType: MediaEntityTypeSchema,
  entityId: z.string(),
  mediaId: z.string(),
  sortOrder: z.number().int().optional(),
})

export const DetachMediaInputSchema = z.object({
  id: z.string(),
})

export type Media = z.infer<typeof MediaSchema>
export type CreateMedia = z.infer<typeof CreateMediaSchema>
export type UpdateMedia = z.infer<typeof UpdateMediaSchema>
export type MediaAttachment = z.infer<typeof MediaAttachmentSchema>
export type CreateMediaAttachment = z.infer<typeof CreateMediaAttachmentSchema>
export type UpdateMediaAttachment = z.infer<typeof UpdateMediaAttachmentSchema>
export type AttachMediaInput = z.infer<typeof AttachMediaInputSchema>
export type SetHeroMediaInput = z.infer<typeof SetHeroMediaInputSchema>
export type DetachMediaInput = z.infer<typeof DetachMediaInputSchema>
