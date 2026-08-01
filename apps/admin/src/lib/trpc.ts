import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@atlora/trpc'

export const trpc = createTRPCReact<AppRouter>()
