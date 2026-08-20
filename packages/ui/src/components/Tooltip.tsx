import * as React from 'react'
import { cn } from '../utils/cn'

const SIDE_POSITION = {
  top:    'bottom-full left-1/2 mb-2 -translate-x-1/2',
  right:  'left-full top-1/2 ml-2 -translate-y-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left:   'right-full top-1/2 mr-2 -translate-y-1/2',
} as const

const SIDE_ARROW = {
  top:    'top-full left-1/2 -mt-[3px] -translate-x-1/2',
  right:  'right-full top-1/2 -mr-[3px] -translate-y-1/2',
  bottom: 'bottom-full left-1/2 -mb-[3px] -translate-x-1/2',
  left:   'left-full top-1/2 -ml-[3px] -translate-y-1/2',
} as const

interface TooltipTriggerProps {
  onMouseEnter?: (event: React.MouseEvent) => void
  onMouseLeave?: (event: React.MouseEvent) => void
  onFocus?: (event: React.FocusEvent) => void
  onBlur?: (event: React.FocusEvent) => void
}

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement<TooltipTriggerProps>
  side?: keyof typeof SIDE_POSITION
  delayMs?: number
}

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(
  ({ content, children, side = 'top', delayMs = 200 }, ref) => {
    const [visible, setVisible] = React.useState(false)
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const bubbleId = React.useId()

    React.useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

    const show = () => {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setVisible(true), delayMs)
    }

    const hide = () => {
      window.clearTimeout(timeoutRef.current)
      setVisible(false)
    }

    const trigger = React.cloneElement(children, {
      'aria-describedby': visible ? bubbleId : undefined,
      onMouseEnter: (event: React.MouseEvent) => {
        children.props.onMouseEnter?.(event)
        show()
      },
      onMouseLeave: (event: React.MouseEvent) => {
        children.props.onMouseLeave?.(event)
        hide()
      },
      onFocus: (event: React.FocusEvent) => {
        children.props.onFocus?.(event)
        show()
      },
      onBlur: (event: React.FocusEvent) => {
        children.props.onBlur?.(event)
        hide()
      },
    } as Partial<TooltipTriggerProps> & { 'aria-describedby'?: string })

    return (
      <span ref={ref} className="relative inline-block">
        {trigger}
        <span
          role="tooltip"
          id={bubbleId}
          aria-hidden={!visible}
          className={cn(
            'pointer-events-none absolute z-50 w-max max-w-[16rem] whitespace-normal rounded-sm',
            'bg-charcoal px-2.5 py-1.5 text-center text-xs text-cream shadow-md',
            'transition-opacity duration-fast ease-brand-out',
            SIDE_POSITION[side],
            visible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {content}
          <span className={cn('absolute h-[6px] w-[6px] rotate-45 bg-charcoal', SIDE_ARROW[side])} />
        </span>
      </span>
    )
  }
)
Tooltip.displayName = 'Tooltip'
