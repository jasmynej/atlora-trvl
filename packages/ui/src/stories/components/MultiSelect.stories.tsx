import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { MultiSelect, type MultiSelectOption } from '../../components/MultiSelect'

const TRIP_STYLE_OPTIONS: MultiSelectOption[] = [
  { value: 'honeymoon',  label: 'Honeymoon' },
  { value: 'family',     label: 'Family' },
  { value: 'adventure',  label: 'Adventure' },
  { value: 'luxury-fit', label: 'Luxury FIT' },
  { value: 'wellness',   label: 'Wellness' },
  { value: 'culinary',   label: 'Culinary' },
]

function ControlledMultiSelect(props: {
  options: MultiSelectOption[]
  defaultValue?: string[]
  maxItems?: number
  disabled?: boolean
  placeholder?: string
}) {
  const [value, setValue] = React.useState(props.defaultValue ?? [])
  return (
    <MultiSelect
      options={props.options}
      value={value}
      onValueChange={setValue}
      maxItems={props.maxItems}
      disabled={props.disabled}
      placeholder={props.placeholder}
    />
  )
}

const meta: Meta<typeof MultiSelect> = {
  title: 'Components/Form/MultiSelect',
  component: MultiSelect,
  parameters: { layout: 'padded' },
  render: () => (
    <div className="max-w-sm">
      <ControlledMultiSelect options={TRIP_STYLE_OPTIONS} defaultValue={['honeymoon']} placeholder="Select trip styles" />
    </div>
  ),
}
export default meta

type Story = StoryObj<typeof MultiSelect>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="type-caption">Empty</span>
        <ControlledMultiSelect options={TRIP_STYLE_OPTIONS} placeholder="Select trip styles" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">With selections</span>
        <ControlledMultiSelect options={TRIP_STYLE_OPTIONS} defaultValue={['honeymoon', 'luxury-fit']} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">Disabled</span>
        <ControlledMultiSelect options={TRIP_STYLE_OPTIONS} defaultValue={['honeymoon']} disabled />
      </div>
    </div>
  ),
}

// ── Max items ─────────────────────────────────────────────────────────────────

export const MaxItems: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <span className="type-caption text-sand-600">Capped at 2 — the "+ Add" control disappears once the limit is hit.</span>
      <ControlledMultiSelect
        options={TRIP_STYLE_OPTIONS}
        defaultValue={['honeymoon', 'luxury-fit']}
        maxItems={2}
      />
    </div>
  ),
}
