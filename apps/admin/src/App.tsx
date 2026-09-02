import { Badge, Button, Card } from '@atlora/ui'

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-100 px-4">
      <Card className="flex w-full max-w-sm flex-col gap-6" padding="lg">
        <div className="flex flex-col gap-1">
          <p className="type-h2">Atlora Admin</p>
          <p className="type-body-sm text-sand-600">Choose which portal you need.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            colorScheme="brand"
            size="md"
            // apps/admin/platform.html is a separate Vite entry — a
            // different bundle on the same origin, so this is a real page
            // navigation, not a client-side route.
            onClick={() => {
              window.location.href = '/platform.html'
            }}
          >
            Platform Admin Login
          </Button>

          <div className="flex flex-col gap-1.5">
            <Button variant="secondary" colorScheme="premium" size="md" disabled title="Agency auth ships in Milestone 3">
              Agency Admin Login
            </Button>
            <div className="flex justify-center">
              <Badge variant="subtle" colorScheme="neutral" size="sm">
                Coming in Milestone 3
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
