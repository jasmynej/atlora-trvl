import { Overlay } from '@atlora/ui'
import { MediaLibraryBrowser, type MediaLibraryBrowserSelection } from './MediaLibraryBrowser'

export interface MediaLibraryPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (media: MediaLibraryBrowserSelection) => void
  selectedId?: string | null
}

export function MediaLibraryPicker({ open, onClose, onSelect, selectedId }: MediaLibraryPickerProps) {
  return (
    <Overlay open={open} onClose={onClose} size="xl" title="Choose from library" aria-label="Media library">
      <MediaLibraryBrowser
        selectedId={selectedId}
        onSelect={(media) => {
          onSelect(media)
          onClose()
        }}
      />
    </Overlay>
  )
}
