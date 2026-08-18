import * as React from 'react'
import { cn } from '../utils/cn'

function RemoveIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onValueChange: (values: string[]) => void
  placeholder?: string
  maxItems?: number
  disabled?: boolean
  className?: string
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ options, value, onValueChange, placeholder = 'Select...', maxItems, disabled, className }, ref) => {
    const selectedOptions = options.filter((option) => value.includes(option.value))
    const availableOptions = options.filter((option) => !value.includes(option.value))
    const atMax = maxItems !== undefined && value.length >= maxItems

    const handleAdd = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const next = event.target.value
      if (next && !value.includes(next)) onValueChange([...value, next])
      event.target.value = ''
    }

    const handleRemove = (optionValue: string) => {
      onValueChange(value.filter((v) => v !== optionValue))
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full flex-wrap items-center gap-1.5',
          'rounded border border-sand-300 bg-white p-1.5',
          'transition-colors duration-base ease-brand-out',
          'hover:border-sand-400',
          'focus-within:border-brand focus-within:shadow-ring',
          disabled && 'pointer-events-none bg-sand-150 opacity-40',
          className
        )}
      >
        {selectedOptions.length === 0 && (
          <span className="type-body-sm px-1.5 text-sand-500">{placeholder}</span>
        )}

        {selectedOptions.map((option) => (
          <span
            key={option.value}
            className="type-caption inline-flex items-center gap-1 rounded-pill bg-sand-150 py-1 pl-2.5 pr-1.5 text-charcoal"
          >
            {option.label}
            <button
              type="button"
              onClick={() => handleRemove(option.value)}
              aria-label={`Remove ${option.label}`}
              disabled={disabled}
              className="rounded-pill p-0.5 text-sand-600 transition-colors hover:bg-sand-200 hover:text-charcoal focus-visible:outline-none focus-visible:shadow-ring"
            >
              <RemoveIcon />
            </button>
          </span>
        ))}

        {!atMax && availableOptions.length > 0 && (
          <select
            value=""
            onChange={handleAdd}
            disabled={disabled}
            aria-label="Add option"
            className="type-body-sm min-w-[6rem] flex-1 appearance-none bg-transparent px-1.5 text-sand-600 focus-visible:outline-none"
          >
            <option value="" disabled hidden>
              + Add
            </option>
            {availableOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    )
  }
)
MultiSelect.displayName = 'MultiSelect'
