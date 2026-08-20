import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from '../../components/Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    size: 'md',
  },
}
export default meta

type Story = StoryObj<typeof Spinner>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <span className="text-brand">
      <Spinner {...args} />
    </span>
  ),
}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 text-brand">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
}

// ── On dark background ────────────────────────────────────────────────────────

export const OnDark: Story = {
  parameters: { backgrounds: { default: 'charcoal' } },
  render: () => (
    <div className="flex items-center gap-4 rounded-md bg-charcoal p-6 text-cream">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
}
