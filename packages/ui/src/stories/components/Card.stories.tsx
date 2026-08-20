import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '../../components/Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'padded' },
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    hoverable: { control: 'boolean' },
  },
  args: {
    padding:   'md',
    hoverable: false,
  },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <p className="type-h3">Bali, Indonesia</p>
      <p className="type-body-sm mt-1">7 nights of rice terraces, temple visits, and private villas.</p>
    </Card>
  ),
}
export default meta

type Story = StoryObj<typeof Card>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Padding ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} padding={padding} className="w-48">
          <span className="type-caption">padding: {padding}</span>
        </Card>
      ))}
    </div>
  ),
}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <Card className="w-56">
        <span className="type-caption">Static</span>
        <p className="type-body-sm mt-1">No hover treatment — plain surface.</p>
      </Card>
      <Card hoverable className="w-56">
        <span className="type-caption">Hoverable</span>
        <p className="type-body-sm mt-1">Hover to see the shadow lift.</p>
      </Card>
    </div>
  ),
}
