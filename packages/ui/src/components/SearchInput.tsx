import * as React from 'react'
import { Input, type InputProps } from './Input'
import { cn } from '../utils/cn'

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export interface SearchInputProps
  extends Omit<InputProps, 'onChange' | 'leftIcon' | 'rightIcon' | 'type'> {
  onSearch: (query: string) => void
  debounceMs?: number
  onClear?: () => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, debounceMs = 300, onClear, defaultValue, className, ...props }, ref) => {
    const [value, setValue] = React.useState(typeof defaultValue === 'string' ? defaultValue : '')
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    React.useEffect(() => {
      return () => clearTimeout(timeoutRef.current)
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      setValue(next)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => onSearch(next), debounceMs)
    }

    const handleClear = () => {
      setValue('')
      clearTimeout(timeoutRef.current)
      onSearch('')
      onClear?.()
    }

    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        leftIcon={<SearchIcon />}
        rightIcon={
          value ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className={cn('text-sand-500 transition-colors hover:text-charcoal', 'focus-visible:outline-none')}
            >
              <ClearIcon />
            </button>
          ) : undefined
        }
        className={className}
        {...props}
      />
    )
  }
)
SearchInput.displayName = 'SearchInput'
