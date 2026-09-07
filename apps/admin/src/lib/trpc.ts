import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@atlora/trpc'

export const agencyTrpc = createTRPCReact<AppRouter>()
