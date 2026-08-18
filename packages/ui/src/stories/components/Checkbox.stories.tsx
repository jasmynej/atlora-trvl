import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '../../components/Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Form/Checkbox',
  component: Checkbox,
  parameters: { layout: 'padded' },
  argTypes: {
    disabled:      { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label:         { control: 'text' },
  },
  args: {
    label:         'Include airport transfers',
    disabled:      false,
    indeterminate: false,
  },
}
export default meta

type Story = StoryObj<typeof Checkbox>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled + checked" disabled defaultChecked />
    </div>
  ),
}

// ── Group (no label prop) ─────────────────────────────────────────────────────

const AMENITIES = ['Airport transfers', 'Travel insurance', 'Private guide', 'Spa credit']

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {AMENITIES.map((amenity) => (
        <Checkbox key={amenity} label={amenity} name="amenities" value={amenity} />
      ))}
    </div>
  ),
}
