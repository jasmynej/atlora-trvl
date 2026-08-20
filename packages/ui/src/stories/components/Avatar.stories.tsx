import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '../../components/Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    src:      { control: 'text' },
    alt:      { control: 'text' },
    fallback: { control: 'text' },
  },
  args: {
    src:      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    alt:      'Jordan Reyes',
    fallback: 'JR',
    size:     'md',
  },
}
export default meta

type Story = StoryObj<typeof Avatar>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Avatar size="xs" fallback="JR" alt="Jordan Reyes" />
      <Avatar size="sm" fallback="JR" alt="Jordan Reyes" />
      <Avatar size="md" fallback="JR" alt="Jordan Reyes" />
      <Avatar size="lg" fallback="JR" alt="Jordan Reyes" />
    </div>
  ),
}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
          alt="Jordan Reyes"
          fallback="JR"
        />
        <span className="type-body-sm">Image loaded</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar src="https://broken.example/does-not-exist.jpg" alt="Jordan Reyes" fallback="JR" />
        <span className="type-body-sm">Image failed to load — falls back to initials</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar alt="Jordan Reyes" fallback="JR" />
        <span className="type-body-sm">No src — initials</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar alt="Unknown traveler" />
        <span className="type-body-sm">No src, no fallback — generic icon</span>
      </div>
    </div>
  ),
}

// ── Group ─────────────────────────────────────────────────────────────────────

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar size="sm" fallback="JR" className="ring-2 ring-white" />
      <Avatar size="sm" fallback="AK" className="ring-2 ring-white" />
      <Avatar size="sm" fallback="ML" className="ring-2 ring-white" />
      <Avatar size="sm" fallback="+3" className="ring-2 ring-white" />
    </div>
  ),
}
