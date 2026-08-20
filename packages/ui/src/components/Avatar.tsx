import * as React from 'react'
import { cn } from '../utils/cn'

// Arbitrary rem values, not `h-<n>`/`w-<n>` — the spacing scale remaps keys
// 1-9 (see tailwind.config.ts), so those utilities would resolve to the
// wrong pixel values here.
const AVATAR_SIZES = {
  xs: 'h-[1.5rem] w-[1.5rem] text-[0.625rem]',
  sm: 'h-[2rem] w-[2rem] text-xs',
  md: 'h-[2.5rem] w-[2.5rem] text-sm',
  lg: 'h-[3.5rem] w-[3.5rem] text-base',
} as const

function GenericIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[60%] w-[60%]">
      <path
        d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4 20.5c0-3.6 3.58-6.5 8-6.5s8 2.9 8 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: keyof typeof AVATAR_SIZES
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt = '', fallback, size = 'md', ...props }, ref) => {
    const [imgFailed, setImgFailed] = React.useState(false)
    const showImage = Boolean(src) && !imgFailed

    return (
      <span
        ref={ref}
        role={showImage ? undefined : 'img'}
        aria-label={showImage ? undefined : alt || undefined}
        className={cn(
          'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden',
          'rounded-pill bg-sand-200 font-sans font-semibold uppercase text-sand-700',
          AVATAR_SIZES[size],
          className
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src as string}
            alt={alt}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : fallback ? (
          <span aria-hidden="true">{fallback}</span>
        ) : (
          <GenericIcon />
        )}
      </span>
    )
  }
)
Avatar.displayName = 'Avatar'
