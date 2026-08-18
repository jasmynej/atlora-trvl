import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const textareaVariants = cva(
  [
    'w-full',
    'font-sans text-charcoal',
    'rounded border border-sand-300 bg-white',
    'px-control-md py-2',
    'transition-colors duration-base ease-brand-out',
    'placeholder:text-sand-500',
    'hover:border-sand-400',
    'focus-visible:outline-none focus-visible:border-brand focus-visible:shadow-ring',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-sand-150 disabled:opacity-40',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-20 text-xs',
        md: 'min-h-24 text-sm',
        lg: 'min-h-32 text-md',
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

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  autoResize?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, error, autoResize, onInput, ...props }, ref) => {
    const handleInput = (event: React.InputEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const el = event.currentTarget
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
      }
      onInput?.(event)
    }

    return (
      <textarea
        ref={ref}
        aria-invalid={error || undefined}
        onInput={handleInput}
        className={cn(
          textareaVariants({ size, error }),
          autoResize && 'resize-none overflow-hidden',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'
