import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from '../../components/EmptyState'
import { Button } from '../../components/Button'

const CompassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M15 9l-2 5-5 2 2-5 5-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
  argTypes: {
    title:       { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title:       'No trips yet',
    description: 'Once you create a trip for this client, it will show up here.',
  },
  render: (args) => (
    <div className="max-w-md rounded-md border border-sand-200">
      <EmptyState {...args} icon={<CompassIcon />} action={<Button size="sm">Create Trip</Button>} />
    </div>
  ),
}
export default meta

type Story = StoryObj<typeof EmptyState>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Composition ───────────────────────────────────────────────────────────────

export const WithSlots: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="w-72 rounded-md border border-sand-200">
        <EmptyState title="No results" description="Try adjusting your filters." />
      </div>
      <div className="w-72 rounded-md border border-sand-200">
        <EmptyState icon={<CompassIcon />} title="No destinations" />
      </div>
      <div className="w-72 rounded-md border border-sand-200">
        <EmptyState
          icon={<CompassIcon />}
          title="No trips yet"
          description="Once you create a trip for this client, it will show up here."
          action={<Button size="sm">Create Trip</Button>}
        />
      </div>
    </div>
  ),
}
