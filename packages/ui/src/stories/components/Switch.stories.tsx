import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '../../components/Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Form/Switch',
  component: Switch,
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    size:     'md',
    disabled: false,
  },
}
export default meta

type Story = StoryObj<typeof Switch>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch size="sm" />
      <Switch size="md" />
    </div>
  ),
}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-3">
        <Switch />
        <span className="type-body-sm">Off (default)</span>
      </label>
      <label className="flex items-center gap-3">
        <Switch defaultChecked />
        <span className="type-body-sm">On</span>
      </label>
      <label className="flex items-center gap-3">
        <Switch disabled />
        <span className="type-body-sm">Disabled, off</span>
      </label>
      <label className="flex items-center gap-3">
        <Switch disabled defaultChecked />
        <span className="type-body-sm">Disabled, on</span>
      </label>
    </div>
  ),
}
