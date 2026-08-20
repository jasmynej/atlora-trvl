import * as React from 'react'
import { Badge, type BadgeProps } from './Badge'

interface StatusStyle {
  colorScheme: NonNullable<BadgeProps['colorScheme']>
  variant?: BadgeProps['variant']
}

// Exhaustive as of the enums documented in `component-inventory.md` §7 —
// PublishStatus, EngagementStatus, InquiryRecipient.status, TripDeparture.status.
// Anything not listed here (Booking/Payment/Commission status aren't enumerated
// yet in data_models.md) falls back to neutral via the default branch below.
const STATUS_STYLES: Record<string, StatusStyle> = {
  // PublishStatus
  DRAFT:     { colorScheme: 'neutral' },
  PUBLISHED: { colorScheme: 'success', variant: 'solid' },

  // EngagementStatus
  INQUIRY:   { colorScheme: 'neutral' },
  ACTIVE:    { colorScheme: 'brand' },
  BOOKED:    { colorScheme: 'success' },
  ARCHIVED:  { colorScheme: 'neutral', variant: 'outline' },

  // InquiryRecipient.status
  PENDING:   { colorScheme: 'neutral' },
  VIEWED:    { colorScheme: 'calm' },
  RESPONDED: { colorScheme: 'brand' },
  DECLINED:  { colorScheme: 'danger' },
  EXPIRED:   { colorScheme: 'danger' },

  // TripDeparture.status
  OPEN:      { colorScheme: 'success' },
  FULL:      { colorScheme: 'warm' },
  CANCELLED: { colorScheme: 'danger' },
}

function defaultLabel(status: string) {
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export interface StatusBadgeProps {
  status: string
  labelMap?: Record<string, string>
  size?: BadgeProps['size']
  className?: string
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, labelMap, size, className }, ref) => {
    const style = STATUS_STYLES[status] ?? { colorScheme: 'neutral' as const }
    const label = labelMap?.[status] ?? defaultLabel(status)

    return (
      <Badge ref={ref} colorScheme={style.colorScheme} variant={style.variant} size={size} className={className}>
        {label}
      </Badge>
    )
  }
)
StatusBadge.displayName = 'StatusBadge'
