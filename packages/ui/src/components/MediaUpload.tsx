import * as React from 'react'
import { cn } from '../utils/cn'
import { Spinner } from './Spinner'
import { Button } from './Button'

export interface MediaUploadValue {
  mediaId: string
  url: string
  altText?: string | null
}

export interface MediaUploadProps {
  value: MediaUploadValue | null
  onChange: (value: MediaUploadValue | null) => void
  onUpload: (file: File) => Promise<MediaUploadValue>
  accept?: string
  disabled?: boolean
  className?: string
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 13V3M10 3L6.5 6.5M10 3l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3.5 13v2a1.5 1.5 0 001.5 1.5h10a1.5 1.5 0 001.5-1.5v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export const MediaUpload = React.forwardRef<HTMLDivElement, MediaUploadProps>(
  ({ value, onChange, onUpload, accept = 'image/*', disabled, className }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [dragActive, setDragActive] = React.useState(false)

    const handleFile = async (file: File | undefined | null) => {
      if (!file || disabled || uploading) return
      setError(null)
      setUploading(true)
      try {
        onChange(await onUpload(file))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    }

    return (
      <div ref={ref} className={cn('flex flex-col gap-2', className)}>
        {value ? (
          <div className="relative w-full overflow-hidden rounded-md border border-sand-200">
            <img src={value.url} alt={value.altText ?? ''} className="h-40 w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-charcoal/50 p-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || uploading}
              >
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() => onChange(null)}
                disabled={disabled || uploading}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragActive(false)
              void handleFile(event.dataTransfer.files[0])
            }}
            disabled={disabled || uploading}
            className={cn(
              'flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed',
              'text-sand-600 transition-colors duration-base ease-brand-out',
              dragActive ? 'border-brand bg-brand-subtle' : 'border-sand-300 hover:border-sand-400',
              (disabled || uploading) && 'pointer-events-none opacity-60'
            )}
          >
            {uploading ? (
              <>
                <Spinner />
                <span className="type-caption">Uploading…</span>
              </>
            ) : (
              <>
                <UploadIcon />
                <span className="type-caption">Click or drag an image to upload</span>
              </>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled || uploading}
          onChange={(event) => {
            void handleFile(event.target.files?.[0])
            event.target.value = ''
          }}
        />

        {error && <span className="type-caption text-danger">{error}</span>}
      </div>
    )
  }
)
MediaUpload.displayName = 'MediaUpload'
