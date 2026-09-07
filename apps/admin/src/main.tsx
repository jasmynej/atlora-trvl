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
        httpBatchLink({ url: 'http://localhost:3001/trpc' }),
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
