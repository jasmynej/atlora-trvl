import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { AgencyGate } from './AgencyGate'
import { getClerkPublishableKey } from './lib/env'
import { TrpcProvider } from './lib/TrpcProvider'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={getClerkPublishableKey()}>
      <TrpcProvider>
        <AgencyGate>
          <App />
        </AgencyGate>
      </TrpcProvider>
    </ClerkProvider>
  </StrictMode>
)
