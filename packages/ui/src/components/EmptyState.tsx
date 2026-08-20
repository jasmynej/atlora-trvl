import * as React from 'react'
import { cn } from '../utils/cn'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center gap-3 px-6 py-12 text-center', className)}
        {...props}
      >
        {icon && (
          <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-sand-150 text-sand-500">
            {icon}
          </span>
        )}
        <div className="flex flex-col gap-1">
          <p className="type-h3">{title}</p>
          {description && <p className="type-body-sm mx-auto max-w-sm">{description}</p>}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = 'EmptyState'
