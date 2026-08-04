import { z } from 'zod'

export const SiteConfigSchema = z.object({
  id: z.string(),
  key: z.string(),
  value: z.string(),
})

export const CreateSiteConfigSchema = SiteConfigSchema.omit({ id: true })
export const UpdateSiteConfigSchema = CreateSiteConfigSchema.partial().extend({ id: z.string() })

export type SiteConfig = z.infer<typeof SiteConfigSchema>
export type CreateSiteConfig = z.infer<typeof CreateSiteConfigSchema>
export type UpdateSiteConfig = z.infer<typeof UpdateSiteConfigSchema>
