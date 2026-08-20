import * as React from 'react'
import { cn } from '../utils/cn'

const DIVIDER_ORIENTATION = {
  horizontal: 'h-px w-full',
  vertical:   'h-full w-px self-stretch',
} as const

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: keyof typeof DIVIDER_ORIENTATION
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => {
    return (
      <hr
        ref={ref}
        aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
        className={cn('shrink-0 border-0 bg-sand-200', DIVIDER_ORIENTATION[orientation], className)}
        {...props}
      />
    )
  }
)
Divider.displayName = 'Divider'
