import * as React from 'react'
import { cn } from '../utils/cn'

// Arbitrary rem value for `lg` — `h-6`/`w-6` would resolve to 2rem under this
// project's remapped spacing scale (see tailwind.config.ts), not the 1.5rem
// intended here. `sm`/`md` are safe because keys 1-4 coincide with Tailwind's
// defaults.
const SPINNER_SIZES = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-[1.5rem] w-[1.5rem]',
} as const

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: keyof typeof SPINNER_SIZES
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn('animate-spin shrink-0', SPINNER_SIZES[size], className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        {...props}
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    )
  }
)
Spinner.displayName = 'Spinner'
