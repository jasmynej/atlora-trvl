import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PlatformAuthProvider, usePlatformAuth } from './lib/auth'
import { platformTrpc } from './lib/trpc'
import { LoginPage } from './pages/LoginPage'
import { Shell } from './components/Shell'
import { CatalogLayout } from './pages/catalog/CatalogLayout'
import { DestinationsPage } from './pages/catalog/DestinationsPage'
import { RegionsPage } from './pages/catalog/RegionsPage'
import { CountriesPage } from './pages/catalog/CountriesPage'
import { PoiPage } from './pages/catalog/PoiPage'
import { MediaLibraryPage } from './pages/MediaLibraryPage'
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
                <Route path="/catalog" element={<CatalogLayout />}>
                  <Route index element={<Navigate to="destinations" replace />} />
                  <Route path="destinations" element={<DestinationsPage />} />
                  <Route path="regions" element={<RegionsPage />} />
                  <Route path="countries" element={<CountriesPage />} />
                  <Route path="poi" element={<PoiPage />} />
                </Route>
                <Route path="/media" element={<MediaLibraryPage />} />
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
    platformTrpc.createClient({
      links: [
        // Relative, not an absolute host:port — single-origin routing
        // through the proxy means this is always same-origin with the
        // page that loaded it, so the browser attaches the session cookie
        // automatically (fetch's default 'same-origin' credentials mode)
        // with no explicit `credentials: 'include'` override needed.
        httpBatchLink({ url: '/api/trpc' }),
      ],
    })
  )

  return (
    <platformTrpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <PlatformAuthProvider>
          <BrowserRouter basename="/admin/platform">
            <AuthedRoutes />
          </BrowserRouter>
        </PlatformAuthProvider>
      </QueryClientProvider>
    </platformTrpc.Provider>
  )
}
