import type { Meta, StoryObj } from '@storybook/react'
import { Select } from '../../components/Select'

const TRIP_STYLE_OPTIONS = [
  { value: 'honeymoon',   label: 'Honeymoon' },
  { value: 'family',      label: 'Family' },
  { value: 'adventure',   label: 'Adventure' },
  { value: 'luxury-fit',  label: 'Luxury FIT' },
  { value: 'wellness',    label: 'Wellness' },
  { value: 'culinary',    label: 'Culinary' },
]

function TripStyleOptions() {
  return (
    <>
      {TRIP_STYLE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </>
  )
}

const meta: Meta<typeof Select> = {
  title: 'Components/Form/Select',
  component: Select,
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error:    { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    size:     'md',
    error:    false,
    disabled: false,
  },
  render: (args) => (
    <Select {...args} defaultValue="">
      <option value="" disabled hidden>Select a trip style</option>
      <TripStyleOptions />
    </Select>
  ),
}
export default meta

type Story = StoryObj<typeof Select>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Select key={size} size={size} defaultValue="">
          <option value="" disabled hidden>Select a trip style</option>
          <TripStyleOptions />
        </Select>
      ))}
    </div>
  ),
}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Select defaultValue="">
        <option value="" disabled hidden>Default</option>
        <TripStyleOptions />
      </Select>
      <Select disabled defaultValue="honeymoon">
        <TripStyleOptions />
      </Select>
      <Select error defaultValue="">
        <option value="" disabled hidden>Error</option>
        <TripStyleOptions />
      </Select>
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
          <Select size={size} defaultValue="honeymoon">
            <TripStyleOptions />
          </Select>
          <Select size={size} error defaultValue="honeymoon">
            <TripStyleOptions />
          </Select>
        </div>
      ))}
    </div>
  ),
}
