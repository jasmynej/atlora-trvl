import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '../../components/Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Form/Textarea',
  component: Textarea,
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error:      { control: 'boolean' },
    disabled:   { control: 'boolean' },
    autoResize: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    placeholder: 'Tell us about your dream trip...',
    size:        'md',
    error:       false,
    disabled:    false,
    autoResize:  false,
  },
}
export default meta

type Story = StoryObj<typeof Textarea>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Textarea size="sm" placeholder="Small" />
      <Textarea size="md" placeholder="Medium" />
      <Textarea size="lg" placeholder="Large" />
    </div>
  ),
}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Textarea placeholder="Default" />
      <Textarea placeholder="Disabled" disabled />
      <Textarea placeholder="Error" error defaultValue="Too short." />
    </div>
  ),
}

// ── Auto-resize ───────────────────────────────────────────────────────────────

export const AutoResize: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <span className="type-caption text-sand-600">Type past the visible height — the box grows with content.</span>
      <Textarea
        autoResize
        placeholder="Start typing..."
        defaultValue="This traveler wants a 10-day honeymoon through the Amalfi Coast, starting in Naples, with a few days split between Positano and Ravello. They mentioned a strong preference for boutique hotels over large resorts, and want at least one private cooking class."
      />
    </div>
  ),
}

// ── Matrix: size × error ──────────────────────────────────────────────────────

export const Matrix: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="type-caption capitalize">{size}</span>
          <Textarea size={size} placeholder="Default" />
          <Textarea size={size} placeholder="Error" error />
        </div>
      ))}
    </div>
  ),
}
