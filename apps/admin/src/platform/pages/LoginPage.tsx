import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, FormField, Input } from '@atlora/ui'
import { usePlatformAuth } from '../lib/auth'

export function LoginPage() {
  const { login, user } = usePlatformAuth()
  const navigate = useNavigate()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      // The server intentionally returns the same generic message for an
      // unknown email and a wrong password (§3 — don't reveal which), and a
      // distinct one for a locked account. Show whatever it sent verbatim.
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-100 px-4">
      <Card className="w-full max-w-sm" padding="lg">
        <div className="mb-6 flex flex-col gap-1">
          <p className="type-h2">Atlora Platform</p>
          <p className="type-body-sm text-sand-600">Sign in to manage the shared catalog and agencies.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Email" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Password" htmlFor="password" required>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormField>

          {error && (
            <p role="alert" className="type-caption text-danger">
              {error}
            </p>
          )}

          <Button type="submit" colorScheme="neutral" loading={submitting} className="mt-2">
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  )
}
