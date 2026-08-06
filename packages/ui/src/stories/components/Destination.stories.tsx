import type { Meta, StoryObj } from '@storybook/react'
import { DestinationCard } from '../../components/DestinationCard'
import { destinationBali, destinationNegril, destinationsList } from '../data'

const meta: Meta<typeof DestinationCard> = {
  title: 'Destination/Card',
  component: DestinationCard,
  parameters: { layout: 'padded' },
  args: {
    destination: destinationBali,
  },
}
export default meta

type Story = StoryObj<typeof DestinationCard>

// ── Interactive ─────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <DestinationCard {...args} />
    </div>
  ),
}

// ── States ──────────────────────────────────────────────────────────────────
// destinationNegril is DRAFT status and has no POIs/gallery — covers the
// "Coming Soon" badge. Every seeded destination has a hero image, so the
// no-image placeholder state is demonstrated with a copy of real data with
// `media` stripped, rather than a fixture that doesn't exist.

const destinationWithoutImage = { ...destinationBali, media: [] }

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div className="flex flex-col gap-2">
        <span className="type-caption">Published</span>
        <DestinationCard destination={destinationBali} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">Draft</span>
        <DestinationCard destination={destinationNegril} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">No hero image</span>
        <DestinationCard destination={destinationWithoutImage} />
      </div>
    </div>
  ),
}

// ── Real data grid ──────────────────────────────────────────────────────────
// Every seeded destination, as it would render in a listing page.

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {destinationsList.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  ),
}
