import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MediaUpload, type MediaUploadValue } from '../../components/MediaUpload'

// A fake, in-story stand-in for the real upload flow (presign + PUT + create
// media row) that consuming apps wire up — this component never talks to the
// network itself, it only orchestrates whatever `onUpload` is passed in.
function fakeUpload(file: File): Promise<MediaUploadValue> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ mediaId: crypto.randomUUID(), url: URL.createObjectURL(file), altText: file.name })
    }, 900)
  })
}

function fakeUploadThatFails(): Promise<MediaUploadValue> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Upload failed: 500')), 900)
  })
}

const meta: Meta<typeof MediaUpload> = {
  title: 'Components/MediaUpload',
  component: MediaUpload,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof MediaUpload>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<MediaUploadValue | null>(null)
    return (
      <div className="max-w-sm">
        <MediaUpload value={value} onChange={setValue} onUpload={fakeUpload} />
      </div>
    )
  },
}

// ── States ────────────────────────────────────────────────────────────────────

export const WithImage: Story = {
  render: () => {
    const [value, setValue] = React.useState<MediaUploadValue | null>({
      mediaId: 'demo-media',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      altText: 'A mountain lake at sunrise',
    })
    return (
      <div className="max-w-sm">
        <MediaUpload value={value} onChange={setValue} onUpload={fakeUpload} />
      </div>
    )
  },
}

export const UploadFails: Story = {
  render: () => {
    const [value, setValue] = React.useState<MediaUploadValue | null>(null)
    return (
      <div className="max-w-sm">
        <MediaUpload value={value} onChange={setValue} onUpload={fakeUploadThatFails} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="max-w-sm">
      <MediaUpload
        value={{ mediaId: 'demo-media', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' }}
        onChange={() => {}}
        onUpload={fakeUpload}
        disabled
      />
    </div>
  ),
}
