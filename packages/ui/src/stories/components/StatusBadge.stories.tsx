import type { Meta, StoryObj } from '@storybook/react'
import { StatusBadge } from '../../components/StatusBadge'

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  parameters: { layout: 'padded' },
  argTypes: {
    status: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    status: 'PUBLISHED',
    size:   'md',
  },
}
export default meta

type Story = StoryObj<typeof StatusBadge>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Domain status sets ────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="type-caption w-32 shrink-0">PublishStatus</span>
        <StatusBadge status="DRAFT" />
        <StatusBadge status="PUBLISHED" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="type-caption w-32 shrink-0">EngagementStatus</span>
        <StatusBadge status="INQUIRY" />
        <StatusBadge status="ACTIVE" />
        <StatusBadge status="BOOKED" />
        <StatusBadge status="ARCHIVED" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="type-caption w-32 shrink-0">InquiryRecipient</span>
        <StatusBadge status="PENDING" />
        <StatusBadge status="VIEWED" />
        <StatusBadge status="RESPONDED" />
        <StatusBadge status="DECLINED" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="type-caption w-32 shrink-0">TripDeparture</span>
        <StatusBadge status="OPEN" />
        <StatusBadge status="FULL" />
        <StatusBadge status="CANCELLED" />
      </div>
    </div>
  ),
}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge status="PUBLISHED" size="sm" />
      <StatusBadge status="PUBLISHED" size="md" />
    </div>
  ),
}

// ── Fallback / labelMap ───────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <StatusBadge status="REFUNDED" />
        <span className="type-body-sm text-sand-600">Unrecognized status — falls back to neutral, Title Case label</span>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status="AWAITING_DEPOSIT" />
        <span className="type-body-sm text-sand-600">Unrecognized, multi-word — default label formatting</span>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status="stage-warm" labelMap={{ 'stage-warm': 'Warm Lead' }} />
        <span className="type-body-sm text-sand-600">Agency-defined stage — label overridden via labelMap</span>
      </div>
    </div>
  ),
}
