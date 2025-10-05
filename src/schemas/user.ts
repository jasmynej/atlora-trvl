import { z } from "zod"

const userCreateSchema = z.object({
    email: z.email(),
    name: z.string().min(2),
    image: z.string().optional()
})

export {userCreateSchema}