import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '../../components/Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circle', 'rect'],
    },
  },
  args: {
    variant: 'rect',
  },
  render: (args) => (
    <div className="w-64">
      <Skeleton {...args} />
    </div>
  ),
}
export default meta

type Story = StoryObj<typeof Skeleton>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Shape variants ────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-48">
        <span className="type-caption">text</span>
        <Skeleton variant="text" className="mt-2" />
      </div>
      <div>
        <span className="type-caption">circle</span>
        <Skeleton variant="circle" className="mt-2" />
      </div>
      <div className="w-48">
        <span className="type-caption">rect</span>
        <Skeleton variant="rect" className="mt-2 h-24" />
      </div>
    </div>
  ),
}

// ── Composition ───────────────────────────────────────────────────────────────
// A DestinationCard-shaped placeholder — the common real-world use case.

export const WithSlots: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3 rounded-md border border-sand-200 p-4">
      <Skeleton variant="rect" className="h-40 w-full" />
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="flex items-center gap-2">
        <Skeleton variant="circle" className="h-8 w-8" />
        <Skeleton variant="text" className="w-24" />
      </div>
    </div>
  ),
}
