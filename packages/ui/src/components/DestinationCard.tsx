import * as React from 'react'
import type { Destination } from '@atlora/types'
import { cn } from '../utils/cn'
import { Card } from './Card'

const DESTINATION_TYPE_LABELS: Record<Destination['type'], string> = {
  city: 'City',
  region_area: 'Region',
  island: 'Island',
  beach: 'Beach',
  national_park: 'National Park',
  other: 'Destination',
}

function PlaceholderIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 19l6-9 4 5 3-4 5 8H3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  destination: Destination
}

export const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  ({ destination, className, ...props }, ref) => {
    const hero = destination.media?.find((attachment) => attachment.role === 'hero')?.media
    const isDraft = destination.status === 'DRAFT'
    const typeLabel = DESTINATION_TYPE_LABELS[destination.type]

    return (
      <Card
        ref={ref}
        padding="none"
        hoverable
        className={cn('group flex flex-col overflow-hidden', className)}
        {...props}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-sand-150">
          {hero ? (
            <img
              src={hero.url}
              alt={hero.altText ?? destination.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-slow ease-brand-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sand-400">
              <PlaceholderIcon />
            </div>
          )}

          {isDraft && (
            <span className="type-eyebrow absolute left-3 top-3 rounded-pill bg-white px-3 py-1 shadow-xs">
              Coming Soon
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-5">
          <span className="type-eyebrow flex items-center gap-1.5">
            {destination.country?.flagSvg && (
              <img
                src={destination.country.flagSvg}
                alt=""
                aria-hidden="true"
                className="h-3 w-4 rounded-xs object-cover"
              />
            )}
            {destination.country?.name ?? typeLabel}
          </span>

          <h3 className="type-h3">{destination.name}</h3>

          {destination.tagline && (
            <p className="type-body-sm line-clamp-2">{destination.tagline}</p>
          )}

          <p className="type-caption mt-auto truncate pt-3">
            {typeLabel}
            {destination.bestTimeToVisit && ` · Best: ${destination.bestTimeToVisit}`}
          </p>
        </div>
      </Card>
    )
  }
)
DestinationCard.displayName = 'DestinationCard'
