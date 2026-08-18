import type { Meta, StoryObj } from '@storybook/react'
import { FormField } from '../../components/FormField'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { Textarea } from '../../components/Textarea'

const meta: Meta<typeof FormField> = {
  title: 'Components/Form/FormField',
  component: FormField,
  parameters: { layout: 'padded' },
  argTypes: {
    label:       { control: 'text' },
    helperText:  { control: 'text' },
    error:       { control: 'text' },
    required:    { control: 'boolean' },
  },
  args: {
    label:      'Trip name',
    htmlFor:    'trip-name',
    helperText: 'Shown to the traveler on their itinerary.',
    required:   true,
  },
  render: (args) => (
    <div className="max-w-sm">
      <FormField {...args}>
        <Input id={args.htmlFor} placeholder="Amalfi Coast Honeymoon" />
      </FormField>
    </div>
  ),
}
export default meta

type Story = StoryObj<typeof FormField>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Wrapping different controls ───────────────────────────────────────────────

export const WithSlots: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      <FormField label="Trip name" htmlFor="ff-input" helperText="Shown to the traveler on their itinerary." required>
        <Input id="ff-input" placeholder="Amalfi Coast Honeymoon" />
      </FormField>

      <FormField label="Trip style" htmlFor="ff-select" helperText="Used to tag this trip for discovery.">
        <Select id="ff-select" defaultValue="">
          <option value="" disabled hidden>Select a trip style</option>
          <option value="honeymoon">Honeymoon</option>
          <option value="family">Family</option>
          <option value="adventure">Adventure</option>
        </Select>
      </FormField>

      <FormField label="Trip summary" htmlFor="ff-textarea" helperText="One or two sentences — shown on the trip card.">
        <Textarea id="ff-textarea" placeholder="A ten-day honeymoon through Positano and Ravello..." />
      </FormField>
    </div>
  ),
}

// ── Error state ───────────────────────────────────────────────────────────────

export const ErrorState: Story = {
  render: () => (
    <div className="max-w-sm">
      <FormField label="Trip name" htmlFor="ff-error" error="Trip name is required." required>
        <Input id="ff-error" error placeholder="Amalfi Coast Honeymoon" />
      </FormField>
    </div>
  ),
}
