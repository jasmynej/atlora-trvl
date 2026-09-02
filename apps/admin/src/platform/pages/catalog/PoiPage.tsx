import { Card, EmptyState } from '@atlora/ui'

export function PoiPage() {
  return (
    <Card>
      <EmptyState
        title="Points of Interest"
        description="Hotels, attractions, restaurants, and other destination-scoped POIs."
      />
    </Card>
  )
}
