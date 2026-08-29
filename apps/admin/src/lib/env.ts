export function getClerkPublishableKey(): string {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  if (!key) {
    throw new Error(
      'VITE_CLERK_PUBLISHABLE_KEY is not set. Copy .env.example to .env and fill in a Clerk publishable key.'
    )
  }
  return key
}

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/trpc'
