# Meridian Travel — Test Agency Spec

This is the canonical reference for the Meridian Travel test agency used throughout Atlora's development and Storybook previews. Use `data-theme="meridian"` (or `<ThemeProvider theme="meridian">`) to apply this theme to any component or screen.

---

## Agency Overview

| Field | Value |
|---|---|
| **Name** | Meridian Travel |
| **Founded** | 2018 |
| **HQ** | Edinburgh, Scotland |
| **Type** | Boutique eco-adventure & cultural immersion |
| **Target market** | Eco-conscious affluent travellers, 35–60 |
| **Avg booking value** | £8,000 – £25,000 |
| **Team size** | 45 |
| **Storybook theme key** | `meridian` |

**Brand personality:** Earthy, trustworthy, and quietly premium. Meridian doesn't shout luxury — it earns it through depth, expertise, and a genuine connection to the places it sends people. Think linen shirts, not evening wear.

---

## Specialties

| Category | Destinations |
|---|---|
| Safari & wildlife | Kenya, Tanzania, Botswana, Rwanda |
| Trek & expedition | Patagonia, Himalaya, Atlas Mountains, Svalbard |
| Cultural immersion | Japan, Morocco, Peru, Jordan |
| Polar & Arctic | Antarctica, Greenland, Iceland |

---

## Brand Color Palette

### Primary — Deep Forest Green

| Token | Value | Use |
|---|---|---|
| `--color-brand` | `#1F5C3A` | Solid button fill, primary CTA |
| `--color-brand-hover` | `#174D30` | Hover state on solid buttons |
| `--color-brand-press` | `#0F3E26` | Active/pressed state |
| `--color-brand-subtle` | `#EDFAF3` | Ghost/outline button hover bg, tinted surfaces |
| `--color-brand-on` | `#FFFFFF` | Text on solid brand backgrounds |
| `--color-brand-fg` | `#1F5C3A` | Brand-colored text/borders on light backgrounds |
| `--shadow-brand` | `0 8px 20px rgba(31, 92, 58, 0.22)` | Elevated brand element shadow |
| `--ring-brand` | `0 0 0 3px rgba(31, 92, 58, 0.28)` | Focus ring |

### Premium — Harvest Gold

| Token | Value | Use |
|---|---|---|
| `--color-premium` | `#C49A28` | Premium/VIP tier accents, upgrade CTAs |
| `--color-premium-subtle` | `#FBF4DC` | Light tinted backgrounds |
| `--color-premium-on` | `#2A1F00` | Text on gold (dark brown for contrast) |
| `--color-premium-fg` | `#A07D1C` | Gold text on light backgrounds |

### Warm — Terra Cotta

| Token | Value | Use |
|---|---|---|
| `--color-warm` | `#C2541A` | Urgency / limited availability / warm accents |
| `--color-warm-subtle` | `#FBEDE5` | Light warm tints |
| `--color-warm-on` | `#FFFFFF` | Text on terra cotta |
| `--color-warm-fg` | `#A04415` | Terra cotta text on light backgrounds |

### Calm — Sage Teal

| Token | Value | Use |
|---|---|---|
| `--color-calm` | `#5B8F84` | Informational / confirmed / eco-certified markers |
| `--color-calm-subtle` | `#EBF3F2` | Light sage tints |
| `--color-calm-on` | `#FFFFFF` | Text on sage teal |
| `--color-calm-fg` | `#4A7870` | Sage teal text on light backgrounds |

### Neutral (shared, not themed)

The sand neutral scale (`sand-100` → `sand-900`) and surface variables (`--bg`, `--surface`, etc.) are inherited from Atlora's base design language and are **not overridden** by the Meridian theme. All agency themes share the same warm cream canvas.

---

## Typography

Typography tokens (Bodoni Moda serif + Raleway sans) are shared across all agency themes. Meridian does not change fonts.

---

## How to Apply in Storybook

Use the **Theme** toolbar in the top Storybook bar to switch between `Atlora (default)` and `Meridian Travel`. The decorator wraps every story in `<div data-theme="meridian">`, which cascades the theme variables down to all components.

To pin a story to Meridian regardless of toolbar:
```tsx
export const MyStory: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme="meridian">
        <Story />
      </ThemeProvider>
    ),
  ],
}
```

---

## How to Apply in App Code

```tsx
import { ThemeProvider } from '@atlora/ui'

// Wrap a portal or page section in the agency's theme
export function MeridianPortal({ children }) {
  return (
    <ThemeProvider theme="meridian">
      {children}
    </ThemeProvider>
  )
}
```

All `@atlora/ui` components inside the wrapper will automatically use Meridian's color palette without any prop changes.

---

## Adding a New Agency Theme

1. Add a `[data-theme="agency-slug"]` block to `packages/ui/src/styles/globals.css` following the same variable structure as `[data-theme="meridian"]`.
2. Add `"agency-slug"` to the `Theme` union type in `packages/ui/src/components/ThemeProvider.tsx`.
3. Add the theme option to the Storybook toolbar in `packages/ui/.storybook/preview.ts`.
4. Document the agency in `atlora-travel/specs/agency-{slug}.md` following this file's format.
