import * as React from 'react'
import { cn } from '../utils/cn'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { MediaTile, type MediaTileItem } from './MediaTile'

export interface MediaGridProps {
  items: MediaTileItem[]
  loading?: boolean
  selectedId?: string | null
  onSelect?: (item: MediaTileItem) => void
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export const MediaGrid = React.forwardRef<HTMLDivElement, MediaGridProps>(
  (
    {
      items,
      loading,
      selectedId,
      onSelect,
      emptyTitle = 'No media yet',
      emptyDescription = 'Upload an image to get started.',
      className,
    },
    ref
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5', className)}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square w-full rounded-md" />
          ))}
        </div>
      )
    }

    if (items.length === 0) {
      return <EmptyState title={emptyTitle} description={emptyDescription} />
    }

    return (
      <div
        ref={ref}
        className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5', className)}
      >
        {items.map((item) => (
          <MediaTile key={item.id} item={item} selected={item.id === selectedId} onClick={onSelect} />
        ))}
      </div>
    )
  }
)
MediaGrid.displayName = 'MediaGrid'
