import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from '../../components/Tooltip'
import { Button } from '../../components/Button'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'padded' },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    content: { control: 'text' },
    delayMs: { control: 'number' },
  },
  args: {
    content: 'Departs from Denpasar (DPS)',
    side:    'top',
    delayMs: 200,
  },
  render: (args) => (
    <div className="p-12">
      <Tooltip {...args}>
        <Button variant="secondary">Hover me</Button>
      </Tooltip>
    </div>
  ),
}
export default meta

type Story = StoryObj<typeof Tooltip>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Placement ─────────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-16 p-16">
      <Tooltip content="Appears above the trigger" side="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Appears right of the trigger" side="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
      <Tooltip content="Appears below the trigger" side="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Appears left of the trigger" side="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
    </div>
  ),
}

// ── Composition ───────────────────────────────────────────────────────────────

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7.25v4M8 5.25v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const WithSlots: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8 p-12">
      <Tooltip content="Total cost per traveler, before taxes and fees">
        <span className="inline-flex cursor-help items-center gap-1 text-sand-600">
          <InfoIcon />
        </span>
      </Tooltip>
      <Tooltip content="This trip is fully booked for the selected dates">
        <Button disabled>Book Now</Button>
      </Tooltip>
    </div>
  ),
}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-12">
      <div className="flex items-center gap-4">
        <span className="type-caption w-32 shrink-0">Default delay (200ms)</span>
        <Tooltip content="Shows after a short hover delay">
          <Button variant="secondary">Hover</Button>
        </Tooltip>
      </div>
      <div className="flex items-center gap-4">
        <span className="type-caption w-32 shrink-0">No delay</span>
        <Tooltip content="Shows immediately" delayMs={0}>
          <Button variant="secondary">Hover</Button>
        </Tooltip>
      </div>
      <div className="flex items-center gap-4">
        <span className="type-caption w-32 shrink-0">Keyboard focus</span>
        <Tooltip content="Also appears on focus for keyboard users">
          <Button variant="secondary">Tab to me</Button>
        </Tooltip>
      </div>
    </div>
  ),
}
