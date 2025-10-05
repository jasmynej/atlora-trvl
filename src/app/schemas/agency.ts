import { z } from "zod"

const agencyCreateSchema = z.object({
    slug: z.string(),
    name: z.string(),
    contact: z.email(),
    theme: z.any().optional(),
    logo: z.string().optional()
})

export {agencyCreateSchema}