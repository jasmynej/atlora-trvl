import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '../../components/Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'subtle', 'outline'],
    },
    colorScheme: {
      control: 'select',
      options: ['brand', 'premium', 'warm', 'calm', 'neutral', 'success', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    children: { control: 'text' },
  },
  args: {
    children:    'Published',
    variant:     'subtle',
    colorScheme: 'brand',
    size:        'md',
  },
}
export default meta

type Story = StoryObj<typeof Badge>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Structural variants ───────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="solid">Solid</Badge>
      <Badge variant="subtle">Subtle</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

// ── Color schemes ─────────────────────────────────────────────────────────────

const COLOR_SCHEMES = ['brand', 'premium', 'warm', 'calm', 'neutral', 'success', 'danger'] as const

export const ColorSchemes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {COLOR_SCHEMES.map((colorScheme) => (
        <div key={colorScheme} className="flex flex-wrap items-center gap-3">
          <span className="type-caption w-20 shrink-0 capitalize">{colorScheme}</span>
          <Badge variant="solid"   colorScheme={colorScheme}>Solid</Badge>
          <Badge variant="subtle"  colorScheme={colorScheme}>Subtle</Badge>
          <Badge variant="outline" colorScheme={colorScheme}>Outline</Badge>
        </div>
      ))}
    </div>
  ),
}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
    </div>
  ),
}

// ── Status pill usage ──────────────────────────────────────────────────────────

export const StatusPills: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge colorScheme="neutral">Draft</Badge>
      <Badge colorScheme="success">Published</Badge>
      <Badge colorScheme="brand">Active</Badge>
      <Badge colorScheme="danger">Cancelled</Badge>
      <Badge colorScheme="warm">Full</Badge>
    </div>
  ),
}

// ── Full matrix: colorScheme × variant × size ─────────────────────────────────

export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['solid', 'subtle', 'outline'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="type-eyebrow">{variant}</span>
          {COLOR_SCHEMES.map((colorScheme) => (
            <div key={colorScheme} className="flex flex-wrap items-center gap-3">
              <span className="type-caption w-20 shrink-0 capitalize">{colorScheme}</span>
              <Badge variant={variant} colorScheme={colorScheme} size="sm">Small</Badge>
              <Badge variant={variant} colorScheme={colorScheme} size="md">Medium</Badge>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}
