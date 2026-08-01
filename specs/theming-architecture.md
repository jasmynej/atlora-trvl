# Theming Architecture

How agency themes work end-to-end: from onboarding to rendered components.

---

## The Core Mechanism

Components in `@atlora/ui` reference CSS custom properties (`var(--color-brand)`, etc.) rather than literal color values. Those variables are resolved at runtime by the nearest ancestor element that defines them.

`ThemeProvider` is that ancestor. It sets the variables in one of two ways:

| Mode | How it works | When to use |
|---|---|---|
| **Preset** (`theme="meridian"`) | Applies `data-theme="meridian"` → CSS class in `globals.css` resolves the vars | Dev, Storybook, hardcoded preview pages |
| **Dynamic** (`colors={obj}`) | Converts a JSON object → CSS custom properties on the element's `style` attribute | Production — theme loaded from DB/API |

Both modes produce identical CSS cascading behavior. The inline style from the dynamic mode has higher specificity than a `[data-theme]` block, so if both props are set, `colors` wins.

---

## Data Flow (Production)

```
Agency onboarding
       │
       ▼
Admin saves brand colors
  → stored in DB as JSON
  → shape: { brand, brandHover, ... }
       │
       ▼
API endpoint
  GET /api/agencies/:id/theme
  → returns { agencyId, name, colors: { ... } }
       │
       ▼
Frontend fetches on app init
  (or passes through SSR props)
       │
       ▼
ThemeProvider receives `colors` prop
  → calls themeColorsToVars(colors)
  → returns CSS custom property map
  → applied as inline style on wrapper <div>
       │
       ▼
All @atlora/ui components inside
resolve their var(--color-brand-*) etc.
against those inline values
→ zero prop changes on any component
```

---

## The JSON Shape

Store this in the `agencies` table (as a JSONB column) or in a dedicated `agency_themes` table.

```json
{
  "agencyId": "meridian",
  "name": "Meridian Travel",
  "colors": {
    "brand":         "#1F5C3A",
    "brandHover":    "#174D30",
    "brandPress":    "#0F3E26",
    "brandSubtle":   "#EDFAF3",
    "brandOn":       "#FFFFFF",
    "brandFg":       "#1F5C3A",

    "premium":       "#C49A28",
    "premiumSubtle": "#FBF4DC",
    "premiumOn":     "#2A1F00",
    "premiumFg":     "#A07D1C",

    "warm":          "#C2541A",
    "warmSubtle":    "#FBEDE5",
    "warmOn":        "#FFFFFF",
    "warmFg":        "#A04415",

    "calm":          "#5B8F84",
    "calmSubtle":    "#EBF3F2",
    "calmOn":        "#FFFFFF",
    "calmFg":        "#4A7870"
  }
}
```

`shadowBrand` and `ringBrand` are optional — `ThemeProvider` auto-derives them from `brand` using rgba conversion if omitted. Agencies that want a custom glow shadow can provide them explicitly.

See `specs/themes/meridian.json` for a complete example.

---

## Required vs. Derivable Fields

| Field | Required | How to derive if missing |
|---|---|---|
| `brand` | Yes | — |
| `brandHover` | Yes | Darken `brand` by ~10% |
| `brandPress` | Yes | Darken `brand` by ~20% |
| `brandSubtle` | Yes | Lighten `brand` to ~5% opacity on white |
| `brandOn` | Yes | White or dark depending on brand luminance |
| `brandFg` | Yes | Same as `brandHover` usually |
| `shadowBrand` | No | `0 8px 20px rgba(brand, 0.22)` |
| `ringBrand` | No | `0 0 0 3px rgba(brand, 0.28)` |
| `premium`, `warm`, `calm` families | Yes | No safe auto-derivation — must be chosen |

A future color picker in the admin UI can auto-suggest `brandHover`, `brandPress`, `brandSubtle`, `brandOn`, and `brandFg` given just the raw `brand` hex.

---

## How to Use in App Code

### Fetching and applying a theme

```tsx
// apps/portal/src/app/layout.tsx  (or apps/admin equivalent)
import { ThemeProvider } from '@atlora/ui'
import type { AgencyThemeColors } from '@atlora/ui'

async function getAgencyTheme(agencyId: string): Promise<AgencyThemeColors> {
  const res = await fetch(`/api/agencies/${agencyId}/theme`)
  const data = await res.json()
  return data.colors
}

export default async function Layout({ children }) {
  const colors = await getAgencyTheme(process.env.AGENCY_ID)

  return (
    <html>
      <body>
        <ThemeProvider colors={colors}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### SSR with Next.js (theme in cookie / header)

```tsx
// The agency ID comes from the subdomain or a session cookie.
// Theme is resolved server-side → no flash of wrong colors.
export default async function RootLayout({ children }) {
  const agencyId = headers().get('x-agency-id') ?? 'atlora'
  const theme = await db.agencyTheme.findUnique({ where: { agencyId } })

  return (
    <html>
      <body>
        <ThemeProvider colors={theme?.colors}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Using `themeColorsToVars` directly (when you can't use ThemeProvider)

```tsx
import { themeColorsToVars } from '@atlora/ui'

// Apply to any element — e.g., a portal rendered in a modal
const vars = themeColorsToVars(agencyColors)
return <div style={vars}><EmailPreview /></div>
```

---

## Onboarding a New Agency

1. **Brand intake** — collect the agency's hex values using the onboarding form. At minimum: `brand`, and at least one color from each of the `premium`, `warm`, `calm` families.

2. **Store in DB** — save the `AgencyThemeColors` JSON object to the `agency_themes` table, keyed by `agencyId`.

3. **Serve from API** — the `GET /api/agencies/:id/theme` endpoint returns the JSON. No CSS file or deployment is needed.

4. **Test in Storybook** — add the JSON to `specs/themes/{slug}.json` and temporarily wire it into the Storybook toolbar via `preview.ts`. Remove before shipping (Storybook uses preset themes only).

No code changes are needed in `packages/ui` to add a new agency theme. No deployment of the design system package is required. The theme travels as data.

---

## When to Use Preset Themes vs. Dynamic Colors

**Use `theme="meridian"` (preset):**
- Storybook stories
- Screenshots / visual regression tests
- Demo environments with fixed agencies
- Cases where CSS specificity of `[data-theme]` is intentional

**Use `colors={obj}` (dynamic):**
- Any production portal where the agency is determined at runtime
- Multi-tenant pages that serve different agencies on the same deployment
- Admin previews that let agencies see their theme live as they edit

**Both together** (`theme` + `colors`): valid for dev fallback — preset theme provides colors while the real API is loading; when `colors` arrives, inline styles take over (higher specificity wins).

---

## What the Theming System Does NOT Control

- **Fonts** — Bodoni Moda + Raleway are shared across all agencies. Font theming is out of scope.
- **Spacing and layout** — Padding, radius, and density are part of the base token system.
- **The neutral (sand) scale** — Warm cream surfaces are shared. Agencies get color accents, not a full palette swap.
- **Typography classes** (`.type-h1`, `.type-body`, etc.) — Shared.

These constraints keep the design system coherent across agencies. Future work could expose a `--radius-*` or `--font-display` override layer if needed.
