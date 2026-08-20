import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1',
    'font-sans font-semibold whitespace-nowrap select-none',
    'rounded-pill border border-transparent',
  ],
  {
    variants: {
      // Structure only — colors live in compoundVariants below.
      variant: {
        solid:   '',
        subtle:  '',
        outline: 'bg-transparent',
      },
      colorScheme: {
        brand:   '',
        premium: '',
        warm:    '',
        calm:    '',
        neutral: '',
        success: '',
        danger:  '',
      },
      size: {
        sm: 'h-5 px-2 text-xs leading-none',
        md: 'h-6 px-2.5 text-xs leading-none',
      },
    },

    compoundVariants: [
      // ── solid (filled) ────────────────────────────────────────────────────
      { variant: 'solid', colorScheme: 'brand',   className: 'bg-brand text-brand-on' },
      { variant: 'solid', colorScheme: 'premium', className: 'bg-premium text-premium-on' },
      { variant: 'solid', colorScheme: 'warm',    className: 'bg-warm text-warm-on' },
      { variant: 'solid', colorScheme: 'calm',    className: 'bg-calm text-calm-on' },
      { variant: 'solid', colorScheme: 'neutral', className: 'bg-sand-700 text-white' },
      { variant: 'solid', colorScheme: 'success', className: 'bg-success text-white' },
      { variant: 'solid', colorScheme: 'danger',  className: 'bg-danger text-white' },

      // ── subtle (tinted background) ───────────────────────────────────────
      { variant: 'subtle', colorScheme: 'brand',   className: 'bg-brand-subtle text-brand-fg' },
      { variant: 'subtle', colorScheme: 'premium', className: 'bg-premium-subtle text-premium-fg' },
      { variant: 'subtle', colorScheme: 'warm',    className: 'bg-warm-subtle text-warm-fg' },
      { variant: 'subtle', colorScheme: 'calm',    className: 'bg-calm-subtle text-calm-fg' },
      { variant: 'subtle', colorScheme: 'neutral', className: 'bg-sand-150 text-sand-700' },
      { variant: 'subtle', colorScheme: 'success', className: 'bg-success-soft text-success' },
      { variant: 'subtle', colorScheme: 'danger',  className: 'bg-danger-soft text-danger' },

      // ── outline ───────────────────────────────────────────────────────────
      { variant: 'outline', colorScheme: 'brand',   className: 'border-brand text-brand-fg' },
      { variant: 'outline', colorScheme: 'premium', className: 'border-premium text-premium-fg' },
      { variant: 'outline', colorScheme: 'warm',    className: 'border-warm text-warm-fg' },
      { variant: 'outline', colorScheme: 'calm',    className: 'border-calm text-calm-fg' },
      { variant: 'outline', colorScheme: 'neutral', className: 'border-sand-400 text-sand-700' },
      { variant: 'outline', colorScheme: 'success', className: 'border-success text-success' },
      { variant: 'outline', colorScheme: 'danger',  className: 'border-danger text-danger' },
    ],

    defaultVariants: {
      variant:     'subtle',
      colorScheme: 'brand',
      size:        'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, colorScheme, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, colorScheme, size }), className)}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'
