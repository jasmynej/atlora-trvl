import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Tag } from '../../components/Tag'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: { layout: 'padded' },
  argTypes: {
    colorScheme: {
      control: 'select',
      options: ['brand', 'neutral'],
    },
    children: { control: 'text' },
  },
  args: {
    children:    'Honeymoon',
    colorScheme: 'neutral',
  },
}
export default meta

type Story = StoryObj<typeof Tag>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Color schemes ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag colorScheme="neutral">Neutral</Tag>
      <Tag colorScheme="brand">Brand</Tag>
    </div>
  ),
}

// ── With remove affordance ──────────────────────────────────────────────────

export const WithSlots: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag colorScheme="neutral" onRemove={() => {}}>Honeymoon</Tag>
      <Tag colorScheme="brand" onRemove={() => {}}>Luxury FIT</Tag>
    </div>
  ),
}

// ── States ────────────────────────────────────────────────────────────────────

function RemovableTagList() {
  const [tags, setTags] = React.useState(['Honeymoon', 'Adventure', 'Family', 'Wellness'])
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <Tag key={tag} colorScheme="brand" onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}>
          {tag}
        </Tag>
      ))}
      {tags.length === 0 && <span className="type-body-sm text-sand-500">No tags left</span>}
    </div>
  )
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="type-caption">Static (not removable)</span>
        <Tag colorScheme="neutral">Specialty</Tag>
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">Removable — click × to dismiss</span>
        <RemovableTagList />
      </div>
    </div>
  ),
}
