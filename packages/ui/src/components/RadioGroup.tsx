import * as React from 'react'
import { cn } from '../utils/cn'

export interface RadioOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  className?: string
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    { name, options, value, defaultValue, onValueChange, orientation = 'vertical', disabled, className },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const handleChange = (optionValue: string) => {
      if (!isControlled) setInternalValue(optionValue)
      onValueChange?.(optionValue)
    }

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={name}
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
          className
        )}
      >
        {options.map((option) => {
          const inputId = `${name}-${option.value}`
          const optionDisabled = disabled || option.disabled

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={cn(
                'inline-flex items-center gap-2',
                optionDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
              )}
            >
              <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
                <input
                  id={inputId}
                  type="radio"
                  name={name}
                  value={option.value}
                  disabled={optionDisabled}
                  checked={currentValue === option.value}
                  onChange={() => handleChange(option.value)}
                  className={cn(
                    'peer absolute inset-0 h-full w-full cursor-pointer appearance-none',
                    'rounded-full border border-sand-300 bg-white',
                    'transition-colors duration-base ease-brand-out',
                    'hover:border-sand-400',
                    'checked:border-brand',
                    'focus-visible:outline-none focus-visible:shadow-ring',
                    'disabled:pointer-events-none'
                  )}
                />
                <span className="pointer-events-none hidden h-2 w-2 rounded-full bg-brand peer-checked:block" />
              </span>
              <span className="type-body-sm">{option.label}</span>
            </label>
          )
        })}
      </div>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'
