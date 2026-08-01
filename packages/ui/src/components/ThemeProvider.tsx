import * as React from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

export type PresetTheme = 'atlora' | 'meridian'

/**
 * The full set of color tokens an agency can configure.
 * This maps 1-to-1 with the CSS custom properties defined in globals.css.
 * Store this shape in the database and serve it from the API.
 */
export interface AgencyThemeColors {
  // Brand / primary action
  brand:          string
  brandHover:     string
  brandPress:     string
  brandSubtle:    string
  brandOn:        string   // text color drawn ON a solid brand background
  brandFg:        string   // brand-colored text drawn ON a light background

  // Premium accent
  premium:        string
  premiumSubtle:  string
  premiumOn:      string
  premiumFg:      string

  // Warm accent
  warm:           string
  warmSubtle:     string
  warmOn:         string
  warmFg:         string

  // Calm accent
  calm:           string
  calmSubtle:     string
  calmOn:         string
  calmFg:         string

  // Optional — auto-derived from brand if omitted
  shadowBrand?:   string
  ringBrand?:     string
}

export interface ThemeProviderProps {
  // Use a preset theme defined in globals.css (good for dev / Storybook)
  theme?:     PresetTheme
  // Use a dynamic theme from the database / API (production agency theming)
  colors?:    AgencyThemeColors
  children:   React.ReactNode
  className?: string
  style?:     React.CSSProperties
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Allows typing CSS custom properties without losing React.CSSProperties safety
type CSSWithVars = React.CSSProperties & { [key: `--${string}`]: string }

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Converts an AgencyThemeColors object into a set of CSS custom property
 * declarations that can be applied as an inline style on any DOM element.
 * Everything inside that element will resolve its `var(--color-brand-*)` etc.
 * against these values — identical to how [data-theme] blocks work in CSS,
 * but driven entirely by runtime data with no stylesheet changes required.
 */
export function themeColorsToVars(colors: AgencyThemeColors): CSSWithVars {
  return {
    '--color-brand':          colors.brand,
    '--color-brand-hover':    colors.brandHover,
    '--color-brand-press':    colors.brandPress,
    '--color-brand-subtle':   colors.brandSubtle,
    '--color-brand-on':       colors.brandOn,
    '--color-brand-fg':       colors.brandFg,
    '--shadow-brand':         colors.shadowBrand ?? `0 8px 20px ${hexToRgba(colors.brand, 0.22)}`,
    '--ring-brand':           colors.ringBrand   ?? `0 0 0 3px ${hexToRgba(colors.brand, 0.28)}`,

    '--color-premium':        colors.premium,
    '--color-premium-subtle': colors.premiumSubtle,
    '--color-premium-on':     colors.premiumOn,
    '--color-premium-fg':     colors.premiumFg,

    '--color-warm':           colors.warm,
    '--color-warm-subtle':    colors.warmSubtle,
    '--color-warm-on':        colors.warmOn,
    '--color-warm-fg':        colors.warmFg,

    '--color-calm':           colors.calm,
    '--color-calm-subtle':    colors.calmSubtle,
    '--color-calm-on':        colors.calmOn,
    '--color-calm-fg':        colors.calmFg,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export const ThemeProvider = React.forwardRef<HTMLDivElement, ThemeProviderProps>(
  ({ theme, colors, children, className, style }, ref) => {
    const themeStyle: React.CSSProperties = colors
      ? { ...themeColorsToVars(colors), ...style }
      : (style ?? {})

    return (
      <div
        ref={ref}
        // data-theme applies a preset [data-theme] block from globals.css.
        // When `colors` is also set, the inline style wins via CSS specificity.
        data-theme={theme}
        className={className}
        style={themeStyle}
      >
        {children}
      </div>
    )
  }
)
ThemeProvider.displayName = 'ThemeProvider'
