import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PlatformAuthProvider, usePlatformAuth } from './lib/auth'
import { trpc } from './lib/trpc'
import { LoginPage } from './pages/LoginPage'
import { Shell } from './components/Shell'
import { CatalogPage } from './pages/CatalogPage'
import { AgenciesPage } from './pages/AgenciesPage'
import { BillingPage } from './pages/BillingPage'
import { AuditLogPage } from './pages/AuditLogPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = usePlatformAuth()

  if (user === undefined) {
    // Still resolving the session — render nothing rather than a flash of
    // the login screen for an already-authenticated user.
    return null
  }
  if (user === null) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function AuthedRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Shell>
              <Routes>
                <Route path="/" element={<Navigate to="/catalog" replace />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/agencies" element={<AgenciesPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/audit-log" element={<AuditLogPage />} />
              </Routes>
            </Shell>
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default function App() {
  const [queryClient] = React.useState(() => new QueryClient())
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3001/trpc',
          // Platform auth is cookie-based (§3) — the browser only attaches
          // the session cookie to a cross-origin request (admin on :3002,
          // api on :3001) if the fetch explicitly opts in.
          fetch(url, options) {
            return fetch(url, { ...options, credentials: 'include' })
          },
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <PlatformAuthProvider>
          <BrowserRouter>
            <AuthedRoutes />
          </BrowserRouter>
        </PlatformAuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
