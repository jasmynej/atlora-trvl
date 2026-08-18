import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-sans font-semibold tracking-wide uppercase',
    'rounded border border-transparent',
    'transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'focus-visible:outline-none focus-visible:shadow-ring',
    'disabled:pointer-events-none disabled:opacity-40',
    'select-none whitespace-nowrap',
  ],
  {
    variants: {
      // Structure only — no colors here (except danger, which is always semantic red)
      variant: {
        primary:   '',
        secondary: '',
        ghost:     '',
        danger:    'bg-danger text-white hover:opacity-90 active:opacity-80',
      },
      // Semantic color role — resolved through CSS variables set by [data-theme].
      // Swap the theme on a parent element; every button updates automatically.
      colorScheme: {
        brand:   '',
        premium: '',
        warm:    '',
        calm:    '',
        // Neutral uses the shared sand scale, which is theme-invariant.
        neutral: '',
      },
      size: {
        sm: 'h-control-sm px-control-sm text-xs gap-1.5',
        md: 'h-control-md px-control-md text-xs',
        lg: 'h-control-lg px-control-lg text-sm',
      },
    },

    compoundVariants: [
      // ── primary (solid filled) ────────────────────────────────────────────
      { variant: 'primary', colorScheme: 'brand',
        className: 'bg-brand text-brand-on hover:bg-brand-hover hover:shadow-brand active:bg-brand-press active:shadow-none' },
      { variant: 'primary', colorScheme: 'premium',
        className: 'bg-premium text-premium-on hover:opacity-90 active:opacity-80' },
      { variant: 'primary', colorScheme: 'warm',
        className: 'bg-warm text-warm-on hover:opacity-90 active:opacity-80' },
      { variant: 'primary', colorScheme: 'calm',
        className: 'bg-calm text-calm-on hover:opacity-90 active:opacity-80' },
      { variant: 'primary', colorScheme: 'neutral',
        className: 'bg-sand-700 text-white hover:bg-sand-800 active:bg-sand-900' },

      // ── secondary (outlined) ──────────────────────────────────────────────
      { variant: 'secondary', colorScheme: 'brand',
        className: 'border-brand text-brand-fg hover:bg-brand-subtle active:bg-brand-subtle active:brightness-95' },
      { variant: 'secondary', colorScheme: 'premium',
        className: 'border-premium text-premium-fg hover:bg-premium-subtle active:bg-premium-subtle active:brightness-95' },
      { variant: 'secondary', colorScheme: 'warm',
        className: 'border-warm text-warm-fg hover:bg-warm-subtle active:bg-warm-subtle active:brightness-95' },
      { variant: 'secondary', colorScheme: 'calm',
        className: 'border-calm text-calm-fg hover:bg-calm-subtle active:bg-calm-subtle active:brightness-95' },
      { variant: 'secondary', colorScheme: 'neutral',
        className: 'border-sand-400 text-sand-700 hover:bg-sand-150 active:bg-sand-200' },

      // ── ghost (text only) ─────────────────────────────────────────────────
      { variant: 'ghost', colorScheme: 'brand',
        className: 'text-brand-fg hover:bg-brand-subtle active:bg-brand-subtle active:brightness-95' },
      { variant: 'ghost', colorScheme: 'premium',
        className: 'text-premium-fg hover:bg-premium-subtle active:bg-premium-subtle active:brightness-95' },
      { variant: 'ghost', colorScheme: 'warm',
        className: 'text-warm-fg hover:bg-warm-subtle active:bg-warm-subtle active:brightness-95' },
      { variant: 'ghost', colorScheme: 'calm',
        className: 'text-calm-fg hover:bg-calm-subtle active:bg-calm-subtle active:brightness-95' },
      { variant: 'ghost', colorScheme: 'neutral',
        className: 'text-sand-700 hover:bg-sand-150 hover:text-charcoal active:bg-sand-200' },
    ],

    defaultVariants: {
      variant:     'primary',
      colorScheme: 'brand',
      size:        'md',
    },
  }
)

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, colorScheme, size, loading, disabled, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, colorScheme, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading ?? undefined}
        {...props}
      >
        {loading ? <Spinner /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'
