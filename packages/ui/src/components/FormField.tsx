import * as React from 'react'
import { cn } from '../utils/cn'

export interface FormFieldProps {
  label: string
  htmlFor: string
  helperText?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, htmlFor, helperText, error, required, children, className }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5', className)}>
        <label htmlFor={htmlFor} className="type-caption font-semibold text-charcoal">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>

        {children}

        {error ? (
          <span className="type-caption text-danger">{error}</span>
        ) : helperText ? (
          <span className="type-caption text-sand-600">{helperText}</span>
        ) : null}
      </div>
    )
  }
)
FormField.displayName = 'FormField'
