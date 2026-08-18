import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup } from '../../components/RadioGroup'

const BUDGET_TIERS = [
  { value: 'standard', label: 'Standard' },
  { value: 'premium',  label: 'Premium' },
  { value: 'luxury',   label: 'Luxury' },
]

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Form/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    name:        'budget-tier',
    options:     BUDGET_TIERS,
    defaultValue: 'premium',
    orientation: 'vertical',
    disabled:    false,
  },
}
export default meta

type Story = StoryObj<typeof RadioGroup>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Orientation ───────────────────────────────────────────────────────────────

export const Orientation: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="type-caption">Vertical (default)</span>
        <RadioGroup name="budget-vertical" options={BUDGET_TIERS} defaultValue="premium" orientation="vertical" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">Horizontal</span>
        <RadioGroup name="budget-horizontal" options={BUDGET_TIERS} defaultValue="premium" orientation="horizontal" />
      </div>
    </div>
  ),
}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="type-caption">No selection</span>
        <RadioGroup name="budget-empty" options={BUDGET_TIERS} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">Group disabled</span>
        <RadioGroup name="budget-disabled" options={BUDGET_TIERS} defaultValue="premium" disabled />
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">Single option disabled</span>
        <RadioGroup
          name="budget-partial"
          options={[
            { value: 'standard', label: 'Standard' },
            { value: 'premium', label: 'Premium' },
            { value: 'luxury', label: 'Luxury (sold out)', disabled: true },
          ]}
          defaultValue="standard"
        />
      </div>
    </div>
  ),
}
