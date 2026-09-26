import * as React from 'react'
import { platformTrpc } from '../lib/trpc'
import { usePlatformMediaUpload } from '../lib/upload'
import { MediaLibraryBrowser } from '../components/MediaLibraryBrowser'
import { Button, Overlay, FormField, Input, MediaUpload, type MediaUploadValue } from '@atlora/ui'

function useMediaByIdQuery(id: string | null) {
  return platformTrpc.media.getById.useQuery({ id: id! }, { enabled: id !== null })
}

export function MediaLibraryPage() {
  const utils = platformTrpc.useUtils()
  const { upload } = usePlatformMediaUpload('platform/library')

  const [uploadOpen, setUploadOpen] = React.useState(false)
  const [uploadValue, setUploadValue] = React.useState<MediaUploadValue | null>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
  const [altText, setAltText] = React.useState('')

  const { data: selected } = useMediaByIdQuery(selectedId)

  const updateMutation = platformTrpc.media.update.useMutation({
    onSuccess: () => {
      utils.media.list.invalidate()
      if (selectedId) utils.media.getById.invalidate({ id: selectedId })
    },
  })

  const deleteMutation = platformTrpc.media.delete.useMutation({
    onSuccess: () => {
      utils.media.list.invalidate()
      setConfirmDeleteOpen(false)
      setSelectedId(null)
    },
  })

  function openDetail(mediaId: string) {
    setSelectedId(mediaId)
  }

  React.useEffect(() => {
    setAltText(selected?.altText ?? '')
  }, [selected?.id, selected?.altText])

  function closeUpload() {
    setUploadOpen(false)
    setUploadValue(null)
  }

  const attachmentCount = selected?.attachments?.length ?? 0

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setUploadOpen(true)}>Upload</Button>
      </div>

      <MediaLibraryBrowser onSelect={(media) => openDetail(media.mediaId)} />

      <Overlay
        open={uploadOpen}
        onClose={closeUpload}
        size="md"
        title="Upload media"
        footer={
          <Button variant="primary" onClick={closeUpload} disabled={!uploadValue}>
            Done
          </Button>
        }
      >
        <MediaUpload
          value={uploadValue}
          onChange={(value) => {
            setUploadValue(value)
            utils.media.list.invalidate()
          }}
          onUpload={upload}
        />
      </Overlay>

      <Overlay
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        size="md"
        title={selected?.filename ?? 'Media'}
        footer={
          <>
            <Button variant="danger" onClick={() => setConfirmDeleteOpen(true)}>
              Delete
            </Button>
            <Button
              variant="primary"
              loading={updateMutation.isPending}
              onClick={() => selectedId && updateMutation.mutate({ id: selectedId, altText: altText || null })}
            >
              Save
            </Button>
          </>
        }
      >
        {selected && (
          <div className="flex flex-col gap-4">
            <img
              src={selected.url}
              alt={selected.altText ?? ''}
              className="max-h-80 w-full rounded-md border border-sand-200 object-contain"
            />
            <FormField label="Alt text" htmlFor="media-alt-text">
              <Input id="media-alt-text" value={altText} onChange={(e) => setAltText(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 type-caption text-sand-600">
              <span>Dimensions: {selected.width && selected.height ? `${selected.width}×${selected.height}` : 'Unknown'}</span>
              <span>Type: {selected.mimeType ?? 'Unknown'}</span>
              <span>Used in {attachmentCount} {attachmentCount === 1 ? 'place' : 'places'}</span>
            </div>
          </div>
        )}
      </Overlay>

      <Overlay
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        size="sm"
        title="Delete media"
        description={
          attachmentCount > 0
            ? `This image is used in ${attachmentCount} ${attachmentCount === 1 ? 'place' : 'places'}. Deleting it will remove it from all of them.`
            : 'This will permanently remove the image from the library.'
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={() => selectedId && deleteMutation.mutate({ id: selectedId })}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="type-body-sm text-sand-700">This action cannot be undone.</p>
      </Overlay>
    </div>
  )
}
