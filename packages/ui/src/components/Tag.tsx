import * as React from 'react'
import { cn } from '../utils/cn'

function RemoveIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const TAG_COLOR_SCHEMES = {
  brand:   { root: 'bg-brand-subtle text-brand-fg', remove: 'hover:bg-brand/15' },
  neutral: { root: 'bg-sand-150 text-charcoal',      remove: 'hover:bg-sand-300' },
} as const

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void
  colorScheme?: keyof typeof TAG_COLOR_SCHEMES
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, onRemove, colorScheme = 'neutral', children, ...props }, ref) => {
    const scheme = TAG_COLOR_SCHEMES[colorScheme]

    return (
      <span
        ref={ref}
        className={cn(
          'type-caption inline-flex items-center gap-1 rounded-pill py-1 pl-2.5 transition-colors',
          onRemove ? 'pr-1.5' : 'pr-2.5',
          scheme.root,
          className
        )}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove"
            className={cn(
              'rounded-pill p-0.5 transition-colors',
              'focus-visible:outline-none focus-visible:shadow-ring',
              scheme.remove
            )}
          >
            <RemoveIcon />
          </button>
        )}
      </span>
    )
  }
)
Tag.displayName = 'Tag'
