import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const switchVariants = cva(
  [
    'relative inline-flex shrink-0 items-center rounded-pill border border-transparent p-[2px]',
    'transition-colors duration-base ease-brand-out',
    'focus-visible:outline-none focus-visible:shadow-ring',
    'disabled:pointer-events-none disabled:opacity-40',
  ],
  {
    variants: {
      size: {
        sm: 'h-[1.25rem] w-[2.25rem]',
        md: 'h-[1.5rem] w-[2.75rem]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const thumbVariants = cva(
  ['pointer-events-none inline-block rounded-pill bg-white shadow-xs transition-transform duration-base ease-brand-out'],
  {
    variants: {
      size: {
        sm: 'h-[1rem] w-[1rem]',
        md: 'h-[1.25rem] w-[1.25rem]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const TRAVEL_DISTANCE = {
  sm: '1rem',
  md: '1.25rem',
} as const

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'>,
    VariantProps<typeof switchVariants> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size, checked, defaultChecked, onCheckedChange, disabled, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(Boolean(defaultChecked))
    const isControlled = checked !== undefined
    const isChecked = isControlled ? checked : internalChecked
    const resolvedSize = size ?? 'md'

    const toggle = () => {
      const next = !isChecked
      if (!isControlled) setInternalChecked(next)
      onCheckedChange?.(next)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={toggle}
        className={cn(switchVariants({ size }), isChecked ? 'bg-brand' : 'bg-sand-300', className)}
        {...props}
      >
        <span
          className={thumbVariants({ size })}
          style={{
            transform: isChecked ? `translateX(${TRAVEL_DISTANCE[resolvedSize]})` : 'translateX(0)',
          }}
        />
      </button>
    )
  }
)
Switch.displayName = 'Switch'
