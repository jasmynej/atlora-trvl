import { z } from "zod"

const agencyCreateSchema = z.object({
    slug: z.string(),
    name: z.string(),
    contact: z.email(),
    theme: z.any().optional(),
    logo: z.string().optional()
})

export const ThemeUpdateSchema = z.object({
    colors: z.object({
        "brand-primary": z.string().optional(),
        "brand-primary-hover": z.string().optional(),
        "brand-accent-1": z.string().optional(),
        "brand-accent-1-hover": z.string().optional(),
        "brand-accent-2": z.string().optional(),
        "brand-accent-2-hover": z.string().optional(),
        "brand-accent-3": z.string().optional(),
        "brand-accent-3-hover": z.string().optional(),
        "brand-bg": z.string().optional(),
        "brand-text": z.string().optional(),
    }).partial().optional(),
    fonts: z.object({
        heading: z.object({
            family: z.string(),
            weights: z.array(z.number()).optional(),
            ital: z.boolean().optional(),
        }).partial().optional(),
        body: z.object({
            family: z.string(),
            weights: z.array(z.number()).optional(),
            ital: z.boolean().optional(),
        }).partial().optional(),
    }).partial().optional(),
}).partial();

export type ThemeUpdateInput = z.infer<typeof ThemeUpdateSchema>;
export {agencyCreateSchema}