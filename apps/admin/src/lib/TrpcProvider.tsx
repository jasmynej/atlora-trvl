import { useAuth } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState, type ReactNode } from 'react'
import { API_URL } from './env'
import { trpc } from './trpc'

// Must render inside <ClerkProvider> — it reads the active session's token
// and attaches it as a bearer token on every tRPC request. Which procedure
// guard accepts that token (agencyProcedure vs. platformProcedure) is decided
// server-side from the JWT's org claim, not by which entry point sent it.
export function TrpcProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: API_URL,
          headers: async () => {
            const token = await getToken()
            return token ? { authorization: `Bearer ${token}` } : {}
          },
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
