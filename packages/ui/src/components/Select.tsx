import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const selectVariants = cva(
  [
    'w-full appearance-none cursor-pointer',
    'font-sans text-charcoal',
    'rounded border border-sand-300 bg-white',
    'transition-colors duration-base ease-brand-out',
    'hover:border-sand-400',
    'focus-visible:outline-none focus-visible:border-brand focus-visible:shadow-ring',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'h-control-sm px-control-sm text-xs',
        md: 'h-control-md px-control-md text-sm',
        lg: 'h-control-lg px-control-lg text-md',
      },
      error: {
        true: 'border-danger hover:border-danger focus-visible:border-danger focus-visible:shadow-none',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  }
)

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, error, disabled, children, ...props }, ref) => {
    return (
      <div className={cn('relative w-full', disabled && 'opacity-40')}>
        <select
          ref={ref}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={cn(selectVariants({ size, error }), disabled && 'bg-sand-150', className)}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sand-500">
          <ChevronIcon />
        </span>
      </div>
    )
  }
)
Select.displayName = 'Select'
