import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from '../../components/Divider'

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className="w-64">
      <p className="type-body-sm">Above the divider</p>
      <Divider {...args} className="my-3" />
      <p className="type-body-sm">Below the divider</p>
    </div>
  ),
}
export default meta

type Story = StoryObj<typeof Divider>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Orientation ───────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-64">
        <span className="type-caption">Horizontal</span>
        <Divider className="my-3" />
      </div>
      <div className="flex h-12 items-center gap-4">
        <span className="type-caption">Vertical</span>
        <Divider orientation="vertical" />
        <span className="type-caption">either side</span>
      </div>
    </div>
  ),
}
