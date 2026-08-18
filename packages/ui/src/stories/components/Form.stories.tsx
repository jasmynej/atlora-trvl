import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../../components/Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Form/Input',
  component: Input,
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error:    { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    placeholder: 'Destination name',
    size:        'md',
    error:       false,
    disabled:    false,
  },
}
export default meta

type Story = StoryObj<typeof Input>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
}

// ── With Slots ────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const WithSlots: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Input leftIcon={<SearchIcon />} placeholder="Search destinations" />
      <Input rightIcon={<CheckIcon />} placeholder="Confirmation code" />
    </div>
  ),
}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Input placeholder="Default" />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Error" error defaultValue="invalid@" />
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
          <Input size={size} placeholder="Default" />
          <Input size={size} placeholder="Error" error />
        </div>
      ))}
    </div>
  ),
}
