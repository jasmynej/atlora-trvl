import * as React from 'react'
import { cn } from '../utils/cn'

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1.5 5.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1.5 5h7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  indeterminate?: boolean
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate, disabled, id, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    const generatedId = React.useId()
    const inputId = id ?? generatedId

    React.useImperativeHandle(ref, () => internalRef.current as HTMLInputElement)

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = Boolean(indeterminate)
      }
    }, [indeterminate])

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-center gap-2',
          disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
          className
        )}
      >
        <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            ref={internalRef}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            className={cn(
              'peer absolute inset-0 h-full w-full cursor-pointer appearance-none',
              'rounded-xs border border-sand-300 bg-white',
              'transition-colors duration-base ease-brand-out',
              'hover:border-sand-400',
              'checked:border-brand checked:bg-brand',
              'focus-visible:outline-none focus-visible:shadow-ring',
              'disabled:pointer-events-none'
            )}
            {...props}
          />
          <span className="pointer-events-none hidden text-brand-on peer-checked:block">
            <CheckIcon />
          </span>
          {indeterminate && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xs bg-brand text-brand-on">
              <DashIcon />
            </span>
          )}
        </span>
        {label && <span className="type-body-sm">{label}</span>}
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'
