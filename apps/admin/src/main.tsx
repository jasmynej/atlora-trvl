import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { agencyTrpc } from './lib/trpc'
import App from './App'
import './index.css'

function Root() {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    agencyTrpc.createClient({
      links: [
        // Relative, not an absolute host:port — single-origin routing
        // through the proxy means this resolves correctly whether served
        // from the host dev server or the built static container, and
        // stays environment-agnostic (no VITE_* env var needed).
        httpBatchLink({ url: '/api/trpc' }),
      ],
    })
  )

  return (
    <agencyTrpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </agencyTrpc.Provider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
