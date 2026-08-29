import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { RouterProvider } from 'react-router-dom'
import { PlatformGate } from './PlatformGate'
import { router } from './routes'
import { getClerkPublishableKey } from '../lib/env'
import { TrpcProvider } from '../lib/TrpcProvider'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={getClerkPublishableKey()}>
      <TrpcProvider>
        <PlatformGate>
          <RouterProvider router={router} />
        </PlatformGate>
      </TrpcProvider>
    </ClerkProvider>
  </StrictMode>
)
