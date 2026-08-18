import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const inputVariants = cva(
  [
    'flex w-full items-center gap-2',
    'font-sans',
    'rounded border border-sand-300 bg-white',
    'transition-colors duration-base ease-brand-out',
    'hover:border-sand-400',
    'focus-within:outline-none focus-within:border-brand focus-within:shadow-ring',
  ],
  {
    variants: {
      size: {
        sm: 'h-control-sm px-control-sm text-xs',
        md: 'h-control-md px-control-md text-sm',
        lg: 'h-control-lg px-control-lg text-md',
      },
      error: {
        true: 'border-danger hover:border-danger focus-within:border-danger focus-within:shadow-none',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, error, disabled, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div
        className={cn(
          inputVariants({ size, error }),
          disabled && 'pointer-events-none bg-sand-150 opacity-40',
          className
        )}
      >
        {leftIcon && <span className="shrink-0 text-sand-500">{leftIcon}</span>}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={error || undefined}
          className="w-full bg-transparent text-charcoal placeholder:text-sand-500 focus:outline-none disabled:cursor-not-allowed"
          {...props}
        />
        {rightIcon && <span className="shrink-0 text-sand-500">{rightIcon}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
