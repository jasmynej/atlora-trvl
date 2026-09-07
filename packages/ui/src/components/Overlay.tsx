import * as React from 'react'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const panelVariants = cva(
  [
    'relative flex max-h-[calc(100vh-4rem)] w-full flex-col',
    'rounded-md bg-white shadow-xl',
    'transition-all duration-base ease-brand-out',
  ],
  {
    variants: {
      size: {
        sm:   'max-w-sm',
        md:   'max-w-md',
        lg:   'max-w-2xl',
        xl:   'max-w-4xl',
        full: 'h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export interface OverlayProps extends VariantProps<typeof panelVariants> {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEsc?: boolean
  initialFocusRef?: React.RefObject<HTMLElement>
  className?: string
  'aria-label'?: string
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      footer,
      children,
      size,
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEsc = true,
      initialFocusRef,
      className,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const [mounted, setMounted] = React.useState(false)
    const [entered, setEntered] = React.useState(false)
    const panelRef = React.useRef<HTMLDivElement>(null)
    const lastFocusedRef = React.useRef<HTMLElement | null>(null)
    const titleId = React.useId()
    const descriptionId = React.useId()

    React.useImperativeHandle(ref, () => panelRef.current as HTMLDivElement)

    // Mount/unmount with a short delay on close so the exit transition can play.
    React.useEffect(() => {
      if (open) {
        setMounted(true)
        const raf = requestAnimationFrame(() => setEntered(true))
        return () => cancelAnimationFrame(raf)
      }
      setEntered(false)
      const timeout = setTimeout(() => setMounted(false), 180)
      return () => clearTimeout(timeout)
    }, [open])

    // Lock body scroll while open.
    React.useEffect(() => {
      if (!mounted) return
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }, [mounted])

    // Focus management: remember trigger, focus into the panel, restore on close.
    React.useEffect(() => {
      if (!mounted) return
      lastFocusedRef.current = document.activeElement as HTMLElement | null
      const toFocus = initialFocusRef?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      toFocus?.focus()
      return () => {
        lastFocusedRef.current?.focus?.()
      }
    }, [mounted, initialFocusRef])

    // Esc to close + focus trap.
    React.useEffect(() => {
      if (!mounted) return
      const handleKeyDown = (event: KeyboardEvent) => {
        if (closeOnEsc && event.key === 'Escape') {
          onClose()
          return
        }
        if (event.key !== 'Tab' || !panelRef.current) return
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [mounted, closeOnEsc, onClose])

    if (!mounted || typeof document === 'undefined') return null

    return createPortal(
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          'bg-charcoal/50 transition-opacity duration-base ease-brand-out',
          entered ? 'opacity-100' : 'opacity-0'
        )}
        onMouseDown={(event) => {
          if (closeOnBackdropClick && event.target === event.currentTarget) onClose()
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title ? undefined : ariaLabel}
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            panelVariants({ size }),
            entered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
            className
          )}
        >
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between gap-4 border-b border-sand-200 px-6 py-4">
              <div className="flex flex-col gap-1">
                {title && (
                  <h2 id={titleId} className="font-serif text-lg text-charcoal">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descriptionId} className="type-caption text-sand-600">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className={cn(
                    'shrink-0 rounded-sm p-1 text-sand-600',
                    'transition-colors duration-fast hover:bg-sand-150 hover:text-charcoal',
                    'focus-visible:outline-none focus-visible:shadow-ring'
                  )}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

          {footer && <div className="flex items-center justify-end gap-3 border-t border-sand-200 px-6 py-4">{footer}</div>}
        </div>
      </div>,
      document.body
    )
  }
)
Overlay.displayName = 'Overlay'
