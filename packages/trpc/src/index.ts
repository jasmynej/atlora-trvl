// Re-exports the AppRouter type from apps/api so frontends never import from
// apps/api directly. Frontends depend on @atlora/trpc for both the type and
// the tRPC client utilities.
export type { AppRouter } from '@atlora/api'
export { createTRPCReact } from '@trpc/react-query'
export { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
export type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
