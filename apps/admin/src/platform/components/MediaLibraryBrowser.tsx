import * as React from 'react'
import { platformTrpc } from '../lib/trpc'
import { MediaGrid, SearchInput, type MediaTileItem } from '@atlora/ui'

export interface MediaLibraryBrowserSelection {
  mediaId: string
  url: string
  altText: string | null
}

export interface MediaLibraryBrowserProps {
  onSelect: (media: MediaLibraryBrowserSelection) => void
  selectedId?: string | null
  className?: string
}

export function MediaLibraryBrowser({ onSelect, selectedId, className }: MediaLibraryBrowserProps) {
  const [search, setSearch] = React.useState('')
  const { data, isLoading } = platformTrpc.media.list.useQuery({ search: search || undefined })

  const items: MediaTileItem[] = (data ?? []).map((media) => ({
    id: media.id,
    url: media.url,
    altText: media.altText,
    filename: media.filename,
  }))

  return (
    <div className={className}>
      <div className="mb-4">
        <SearchInput placeholder="Search media…" onSearch={setSearch} />
      </div>
      <MediaGrid
        items={items}
        loading={isLoading}
        selectedId={selectedId}
        onSelect={(item) => onSelect({ mediaId: item.id, url: item.url, altText: item.altText ?? null })}
        emptyTitle={search ? 'No matches' : 'No media yet'}
        emptyDescription={search ? 'Try a different search.' : 'Upload an image to get started.'}
      />
    </div>
  )
}
