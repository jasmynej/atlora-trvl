import * as React from 'react'
import { cn } from '../utils/cn'

export interface MediaTileItem {
  id: string
  url: string
  altText?: string | null
  filename?: string | null
}

export interface MediaTileProps {
  item: MediaTileItem
  selected?: boolean
  onClick?: (item: MediaTileItem) => void
  className?: string
}

export const MediaTile = React.forwardRef<HTMLButtonElement, MediaTileProps>(
  ({ item, selected, onClick, className }, ref) => {
    const caption = item.filename ?? item.altText ?? ''

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onClick?.(item)}
        className={cn(
          'group flex flex-col overflow-hidden rounded-md border text-left transition-colors duration-base ease-brand-out',
          selected ? 'border-brand ring-2 ring-brand' : 'border-sand-200 hover:border-sand-400',
          className
        )}
      >
        <div className="aspect-square w-full overflow-hidden bg-sand-100">
          <img
            src={item.url}
            alt={item.altText ?? ''}
            className="h-full w-full object-cover transition-transform duration-base ease-brand-out group-hover:scale-105"
          />
        </div>
        {caption && (
          <span className="type-caption truncate px-2 py-1.5 text-sand-600">{caption}</span>
        )}
      </button>
    )
  }
)
MediaTile.displayName = 'MediaTile'
