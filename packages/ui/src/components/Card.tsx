import * as React from 'react'
import { cn } from '../utils/cn'

const CARD_PADDING = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
} as const

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: keyof typeof CARD_PADDING
  hoverable?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', hoverable, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md border border-sand-200 bg-white shadow-sm',
          hoverable && 'transition-shadow duration-base ease-brand-out hover:shadow-md',
          CARD_PADDING[padding],
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'
