import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',

      teal: {
        50: '#E6F4F7',
        100: '#C2E5EC',
        200: '#8DD0DC',
        300: '#4FB6C8',
        400: '#1F9FB8',
        500: '#0091AB',
        600: '#007C93',
        700: '#006375',
        800: '#054C5A',
        900: '#0A3A44',
      },

      sand: {
        50: '#FFFFFF',
        100: '#FAF8F6',
        150: '#F4F0EB',
        200: '#EDE7DF',
        300: '#E0D8CD',
        400: '#C9BFB2',
        500: '#A89E90',
        600: '#7C7468',
        700: '#57524B',
        800: '#3D3A35',
        900: '#343432',
      },

      pink: {
        100: '#FDEDF2',
        200: '#FBD3DF',
        500: '#F7AAC1',
        700: '#D97A99',
      },

      gold: {
        100: '#FBF1E3',
        200: '#F4DDBE',
        500: '#E7B06F',
        700: '#C68B43',
      },

      lavender: {
        100: '#F1EFF5',
        200: '#DEDAE7',
        500: '#B9B1C9',
        700: '#8C829F',
      },

      cream: '#FAF8F6',
      charcoal: '#343432',

      success: { DEFAULT: '#2F8F6B', soft: '#E2F1EA' },
      warning: { DEFAULT: '#C68B43', soft: '#FBF1E3' },
      danger:  { DEFAULT: '#C8553D', soft: '#F8E5DF' },
      info:    { DEFAULT: '#007C93', soft: '#E6F4F7' },

      // ── Semantic / theme-aware colors ────────────────────────────────────────
      // These reference CSS variables that each [data-theme] block overrides.
      // Use these in components instead of literal palette values.
      brand: {
        DEFAULT: 'var(--color-brand)',
        hover:   'var(--color-brand-hover)',
        press:   'var(--color-brand-press)',
        subtle:  'var(--color-brand-subtle)',
        on:      'var(--color-brand-on)',
        fg:      'var(--color-brand-fg)',
      },
      premium: {
        DEFAULT: 'var(--color-premium)',
        subtle:  'var(--color-premium-subtle)',
        on:      'var(--color-premium-on)',
        fg:      'var(--color-premium-fg)',
      },
      warm: {
        DEFAULT: 'var(--color-warm)',
        subtle:  'var(--color-warm-subtle)',
        on:      'var(--color-warm-on)',
        fg:      'var(--color-warm-fg)',
      },
      calm: {
        DEFAULT: 'var(--color-calm)',
        subtle:  'var(--color-calm-subtle)',
        on:      'var(--color-calm-on)',
        fg:      'var(--color-calm-fg)',
      },
    },

    fontFamily: {
      serif: ['"Bodoni Moda"', 'Didot', '"Times New Roman"', 'serif'],
      sans:  ['Raleway', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      mono:  ['"SFMono-Regular"', '"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
    },

    fontSize: {
      xs:    ['0.75rem',  { lineHeight: '1.4' }],
      sm:    ['0.875rem', { lineHeight: '1.5' }],
      base:  ['1rem',     { lineHeight: '1.7' }],
      md:    ['1.125rem', { lineHeight: '1.7' }],
      lg:    ['1.375rem', { lineHeight: '1.5' }],
      xl:    ['1.75rem',  { lineHeight: '1.25' }],
      '2xl': ['2.25rem',  { lineHeight: '1.25' }],
      '3xl': ['3rem',     { lineHeight: '1.08' }],
      '4xl': ['4rem',     { lineHeight: '1.08' }],
      '5xl': ['5.5rem',   { lineHeight: '1.08' }],
    },

    letterSpacing: {
      tight:  '-0.01em',
      normal: '0',
      wide:   '0.08em',
      wider:  '0.18em',
    },

    lineHeight: {
      tight:   '1.08',
      snug:    '1.25',
      normal:  '1.5',
      relaxed: '1.7',
    },

    borderRadius: {
      none:    '0',
      xs:      '4px',
      sm:      '8px',
      DEFAULT: '8px',
      md:      '12px',
      lg:      '18px',
      xl:      '28px',
      pill:    '999px',
    },

    boxShadow: {
      xs:      '0 1px 2px rgba(52, 52, 50, 0.06)',
      sm:      '0 1px 3px rgba(52, 52, 50, 0.08), 0 1px 2px rgba(52, 52, 50, 0.04)',
      DEFAULT: '0 4px 12px rgba(52, 52, 50, 0.08), 0 2px 4px rgba(52, 52, 50, 0.05)',
      md:      '0 4px 12px rgba(52, 52, 50, 0.08), 0 2px 4px rgba(52, 52, 50, 0.05)',
      lg:      '0 12px 28px rgba(52, 52, 50, 0.12), 0 4px 8px rgba(52, 52, 50, 0.06)',
      xl:      '0 24px 56px rgba(52, 52, 50, 0.16), 0 8px 16px rgba(52, 52, 50, 0.07)',
      teal:    '0 8px 20px rgba(0, 145, 171, 0.22)',
      // Themed variants — resolve via CSS variables set by [data-theme]
      brand:   'var(--shadow-brand)',
      ring:    'var(--ring-brand)',
      none:    'none',
    },

    extend: {
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.5rem',
        6: '2rem',
        7: '3rem',
        8: '4rem',
        9: '6rem',
      },

      transitionTimingFunction: {
        'brand-out':  'cubic-bezier(0.22, 1, 0.36, 1)',
        'brand-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      transitionDuration: {
        fast: '120ms',
        base: '220ms',
        slow: '420ms',
      },

      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
} satisfies Config
