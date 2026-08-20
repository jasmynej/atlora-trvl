import * as React from 'react'
import { cn } from '../utils/cn'

const SKELETON_VARIANTS = {
  text:   'h-4 w-full rounded-xs',
  circle: 'h-10 w-10 rounded-pill',
  rect:   'h-24 w-full rounded-sm',
} as const

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof SKELETON_VARIANTS
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rect', ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('animate-pulse bg-sand-200', SKELETON_VARIANTS[variant], className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'
