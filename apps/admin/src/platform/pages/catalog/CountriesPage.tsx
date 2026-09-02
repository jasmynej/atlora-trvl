import { Card, EmptyState } from '@atlora/ui'

export function CountriesPage() {
  return (
    <Card>
      <EmptyState
        title="Countries"
        description="Reference geography data (seeded from REST Countries) — browse and region assignment."
      />
    </Card>
  )
}
