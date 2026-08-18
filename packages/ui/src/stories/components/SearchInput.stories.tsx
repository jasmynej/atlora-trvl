import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { SearchInput } from '../../components/SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Form/SearchInput',
  component: SearchInput,
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled:   { control: 'boolean' },
    debounceMs: { control: 'number' },
    placeholder: { control: 'text' },
  },
  args: {
    placeholder: 'Search destinations',
    size:        'md',
    disabled:    false,
    debounceMs:  300,
  },
  render: (args) => <SearchInput {...args} onSearch={() => {}} />,
}
export default meta

type Story = StoryObj<typeof SearchInput>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <SearchInput size="sm" placeholder="Small" onSearch={() => {}} />
      <SearchInput size="md" placeholder="Medium" onSearch={() => {}} />
      <SearchInput size="lg" placeholder="Large" onSearch={() => {}} />
    </div>
  ),
}

// ── With value (shows the clear button) ───────────────────────────────────────

export const WithValue: Story = {
  render: () => (
    <div className="max-w-sm">
      <SearchInput defaultValue="Amalfi Coast" placeholder="Search destinations" onSearch={() => {}} />
    </div>
  ),
}

// ── Live debounce demo ────────────────────────────────────────────────────────

export const LiveDebounce: Story = {
  render: () => {
    function LiveDemo() {
      const [lastQuery, setLastQuery] = React.useState('')
      return (
        <div className="flex max-w-sm flex-col gap-2">
          <SearchInput placeholder="Search destinations" debounceMs={400} onSearch={setLastQuery} />
          <span className="type-caption text-sand-600">
            Last search fired: {lastQuery ? `"${lastQuery}"` : '(none yet)'}
          </span>
        </div>
      )
    }
    return <LiveDemo />
  },
}
