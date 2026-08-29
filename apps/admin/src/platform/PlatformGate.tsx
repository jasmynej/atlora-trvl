import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import type { ReactNode } from 'react'

// Client-side UX only — the real boundary is platformProcedure in
// apps/api/src/trpc.ts. Every request this app makes gets re-checked there
// (no org claim, and a matching active PlatformUser row) regardless of what
// this component decided. This gate exists so a mis-signed-in visitor sees a
// clear message instead of a wall of failed queries.
export function PlatformGate({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <RequireNoOrg>{children}</RequireNoOrg>
      </SignedIn>
    </>
  )
}

function RequireNoOrg({ children }: { children: ReactNode }) {
  const { orgId, isLoaded } = useAuth()

  if (!isLoaded) return null

  if (orgId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-6">
        <div className="max-w-sm rounded-md border border-border bg-surface p-6 text-center">
          <p className="type-label mb-2">Wrong surface</p>
          <p className="type-body-sm text-fg2">
            This session belongs to an agency organization. Platform admin is for Atlora staff
            with no agency membership — sign in with a platform account instead.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
