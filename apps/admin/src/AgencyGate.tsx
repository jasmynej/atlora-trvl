import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import type { ReactNode } from 'react'

// Client-side UX only — asserting "no org → reject" here is a convenience,
// not the security boundary. The boundary is agencyProcedure in
// apps/api/src/trpc.ts, which every agency request re-checks regardless of
// what this component decided.
export function AgencyGate({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <RequireOrg>{children}</RequireOrg>
      </SignedIn>
    </>
  )
}

function RequireOrg({ children }: { children: ReactNode }) {
  const { orgId, isLoaded } = useAuth()

  if (!isLoaded) return null

  if (!orgId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-6">
        <div className="max-w-sm rounded-md border border-border bg-surface p-6 text-center">
          <p className="type-label mb-2">No agency selected</p>
          <p className="type-body-sm text-fg2">
            This account isn't a member of an agency organization, so it can't open the agency
            admin. Platform staff should use the platform admin instead.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
