import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../components/Button'
import { ThemeProvider } from '../../components/ThemeProvider'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    colorScheme: {
      control: 'select',
      options: ['brand', 'premium', 'warm', 'calm', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children:    'Explore Destinations',
    variant:     'primary',
    colorScheme: 'brand',
    size:        'md',
    loading:     false,
    disabled:    false,
  },
}
export default meta

type Story = StoryObj<typeof Button>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── Structural variants ───────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary">Book Now</Button>
      <Button variant="secondary">Learn More</Button>
      <Button variant="ghost" colorScheme="neutral">View All</Button>
      <Button variant="danger">Cancel Trip</Button>
    </div>
  ),
}

// ── Color schemes ─────────────────────────────────────────────────────────────

const COLOR_SCHEMES = ['brand', 'premium', 'warm', 'calm', 'neutral'] as const

export const ColorSchemes: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {COLOR_SCHEMES.map((colorScheme) => (
        <div key={colorScheme} className="flex flex-wrap items-center gap-4">
          <span className="type-caption w-20 shrink-0 capitalize">{colorScheme}</span>
          <Button variant="primary"   colorScheme={colorScheme}>Book Now</Button>
          <Button variant="secondary" colorScheme={colorScheme}>Learn More</Button>
          <Button variant="ghost"     colorScheme={colorScheme}>View All</Button>
        </div>
      ))}
    </div>
  ),
}

// ── Theme comparison ──────────────────────────────────────────────────────────
// Shows the same buttons side-by-side in each agency theme.
// Uses ThemeProvider directly so both themes are visible simultaneously,
// regardless of the Storybook toolbar selection.

export const ThemeComparison: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-8">
      {(['atlora', 'meridian'] as const).map((theme) => (
        <ThemeProvider key={theme} theme={theme} className="flex flex-col gap-4 p-6 rounded-md border border-sand-300">
          <span className="type-eyebrow">{theme === 'atlora' ? 'Atlora (default)' : 'Meridian Travel'}</span>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Book Now</Button>
            <Button variant="secondary">Learn More</Button>
            <Button variant="ghost" colorScheme="neutral">View All</Button>
            <Button variant="danger">Cancel Trip</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button colorScheme="premium">Premium</Button>
            <Button variant="secondary" colorScheme="premium">Premium</Button>
            <Button colorScheme="warm">Warm</Button>
            <Button colorScheme="calm">Calm</Button>
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

// ── With Icons ────────────────────────────────────────────────────────────────

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Globe = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 1.5C8 1.5 5.5 4 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4 10.5 8S8 14.5 8 14.5M1.5 8h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <Button leftIcon={<Globe />}>Explore World</Button>
        <Button rightIcon={<ArrowRight />}>Book Now</Button>
        <Button variant="secondary" rightIcon={<ArrowRight />}>View Itinerary</Button>
        <Button variant="ghost" colorScheme="neutral" leftIcon={<Globe />}>All Destinations</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button colorScheme="premium" leftIcon={<Globe />}>Premium Journey</Button>
        <Button variant="secondary" colorScheme="premium" rightIcon={<ArrowRight />}>View Package</Button>
      </div>
    </div>
  ),
}

// ── Loading ───────────────────────────────────────────────────────────────────

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button loading>Primary</Button>
      <Button variant="secondary" loading>Secondary</Button>
      <Button variant="ghost" colorScheme="neutral" loading>Ghost</Button>
      <Button variant="danger" loading>Danger</Button>
    </div>
  ),
}

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="ghost" colorScheme="neutral" disabled>Ghost</Button>
      <Button variant="danger" disabled>Danger</Button>
    </div>
  ),
}

// ── Full matrix: colorScheme × variant × size ─────────────────────────────────

export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-3">
          <span className="type-eyebrow">{variant}</span>
          {COLOR_SCHEMES.map((colorScheme) => (
            <div key={colorScheme} className="flex flex-wrap items-center gap-4">
              <span className="type-caption w-20 shrink-0 capitalize">{colorScheme}</span>
              <Button variant={variant} colorScheme={colorScheme} size="sm">Small</Button>
              <Button variant={variant} colorScheme={colorScheme} size="md">Medium</Button>
              <Button variant={variant} colorScheme={colorScheme} size="lg">Large</Button>
            </div>
          ))}
        </div>
      ))}
      <div className="flex flex-col gap-3">
        <span className="type-eyebrow">danger</span>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="danger" size="sm">Small</Button>
          <Button variant="danger" size="md">Medium</Button>
          <Button variant="danger" size="lg">Large</Button>
        </div>
      </div>
    </div>
  ),
}
