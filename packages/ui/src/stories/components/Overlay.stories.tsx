import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Overlay } from '../../components/Overlay'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { FormField } from '../../components/FormField'

const meta: Meta<typeof Overlay> = {
  title: 'Components/Overlay',
  component: Overlay,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Overlay>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="flex min-h-[24rem] items-center justify-center">
        <Button onClick={() => setOpen(true)}>Open Overlay</Button>
        <Overlay
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm cancellation"
          description="This trip has travelers with confirmed bookings."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Keep trip
              </Button>
              <Button variant="primary" colorScheme="calm" onClick={() => setOpen(false)}>
                Cancel trip
              </Button>
            </>
          }
        >
          <p className="type-body text-sand-700">
            Cancelling will notify all 12 travelers and release held inventory. This cannot be undone.
          </p>
        </Overlay>
      </div>
    )
  },
}

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => {
    const [openSize, setOpenSize] = React.useState<null | 'sm' | 'md' | 'lg' | 'xl' | 'full'>(null)
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const
    return (
      <div className="flex min-h-[24rem] flex-wrap items-center justify-center gap-4">
        {sizes.map((size) => (
          <Button key={size} variant="secondary" onClick={() => setOpenSize(size)}>
            {size.toUpperCase()}
          </Button>
        ))}
        {sizes.map((size) => (
          <Overlay
            key={size}
            open={openSize === size}
            onClose={() => setOpenSize(null)}
            size={size}
            title={`${size.toUpperCase()} overlay`}
          >
            <p className="type-body text-sand-700">This overlay uses the "{size}" size variant.</p>
          </Overlay>
        ))}
      </div>
    )
  },
}

// ── Composition ───────────────────────────────────────────────────────────────

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="flex min-h-[24rem] items-center justify-center">
        <Button onClick={() => setOpen(true)}>Add Traveler</Button>
        <Overlay
          open={open}
          onClose={() => setOpen(false)}
          size="md"
          title="Add traveler"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Save traveler
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <FormField label="Full name" htmlFor="traveler-name">
              <Input id="traveler-name" placeholder="Jamie Rivera" />
            </FormField>
            <FormField label="Email" htmlFor="traveler-email">
              <Input id="traveler-email" type="email" placeholder="jamie@example.com" />
            </FormField>
          </div>
        </Overlay>
      </div>
    )
  },
}

// ── States ────────────────────────────────────────────────────────────────────

export const WithoutCloseButton: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="flex min-h-[24rem] items-center justify-center">
        <Button onClick={() => setOpen(true)}>Open (no close button)</Button>
        <Overlay
          open={open}
          onClose={() => setOpen(false)}
          title="Processing payment"
          showCloseButton={false}
          closeOnBackdropClick={false}
          closeOnEsc={false}
          footer={<Button onClick={() => setOpen(false)}>Done</Button>}
        >
          <p className="type-body text-sand-700">Please wait while we confirm your booking with the vendor.</p>
        </Overlay>
      </div>
    )
  },
}
