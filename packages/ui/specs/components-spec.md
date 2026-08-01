# @atlora/ui — Component Authoring Spec

A practical guide for building components in this design system: when to reach for CVA, how to structure variants, and a repeatable manual workflow that keeps AI out of the loop.

---

## 1. Guiding Principles

- **Tokens over hardcoded values.** Every color, spacing, radius, shadow, and easing used in a component must trace back to a CSS variable in `globals.css` or a Tailwind utility generated from `tailwind.config.ts`. Never write `#0091AB` in a component file.
- **No logic in this package.** `packages/ui` is a pure component library. No data fetching, no routing, no state beyond what a component needs to render itself.
- **Composition over configuration.** Prefer accepting `leftIcon` / `rightIcon` / `children` props over a growing list of boolean flags like `hasIcon`, `showBadge`. Let callers compose.
- **Accessible by default.** Every interactive component ships with ARIA roles, focus-visible rings, and keyboard behavior. These are not added later.
- **One component, one file.** Avoid barrel files inside `src/components/` that re-export multiple components. Each component gets its own file exported from `src/index.ts`.

---

## 2. When to Use CVA

Use `class-variance-authority` (CVA) when a component has **two or more independently varying dimensions** (e.g., variant × size). A single optional prop (e.g., `disabled`) does not warrant CVA — handle it with a conditional `cn()` call.

### Decision table

| Situation | Tool |
|---|---|
| One style, no variation | Plain `className` string |
| One varying dimension (e.g., just `size`) | `cn()` with a lookup object |
| Two+ varying dimensions | `cva()` |
| Complex compound variants | `cva()` with `compoundVariants` |

### CVA anatomy

```ts
const componentVariants = cva(
  // 1. Base classes — always applied
  ['inline-flex items-center', 'rounded', 'transition-all duration-[220ms]'],
  {
    variants: {
      // 2. Each key is an independent dimension
      variant: {
        primary:   'bg-teal-500 text-white hover:bg-teal-600',
        secondary: 'border border-teal-500 text-teal-600 hover:bg-teal-50',
      },
      size: {
        sm: 'h-8 px-4 text-xs',
        md: 'h-10 px-5 text-xs',
        lg: 'h-12 px-6 text-sm',
      },
    },
    // 3. Compound variants — apply classes only when two conditions are met
    compoundVariants: [
      { variant: 'primary', size: 'lg', className: 'shadow-teal' },
    ],
    // 4. Defaults — what renders when props are omitted
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
```

### Using CVA in a component

Always pipe the CVA output through `cn()` so callers can override with `className`:

```ts
export const Component = ({ variant, size, className, ...props }) => (
  <div className={cn(componentVariants({ variant, size }), className)} {...props} />
)
```

### What goes in base vs. a variant

| Put in **base** | Put in a **variant** |
|---|---|
| Layout (`inline-flex`, `items-center`) | Colors (`bg-*`, `text-*`, `border-*`) |
| Border radius | Shadows tied to a specific color |
| Transition | Padding and height (size-specific) |
| Focus ring | Font size |
| `disabled:` states | Hover/active state colors |
| `select-none`, `whitespace-nowrap` | |

**Rule of thumb:** if it's the same across all combinations, it goes in base. If it changes when you switch a dimension, it goes in that dimension's variant.

### Conflict resolution

When base and a variant both set the same property (e.g., `gap-2` in base, `gap-1.5` in `size.sm`), `twMerge` inside `cn()` resolves it — the variant value wins because it appears later in the string. This is automatic; you don't need to remove the base class.

---

## 3. Anatomy of a Component File

```
src/components/ComponentName.tsx
```

```tsx
// 1. React import — always forwardRef for DOM-facing components
import * as React from 'react'

// 2. CVA import
import { cva, type VariantProps } from 'class-variance-authority'

// 3. Internal utilities only — no external UI libraries
import { cn } from '../utils/cn'

// 4. Variant definition — outside the component, at module scope
const componentVariants = cva(/* ... */)

// 5. Internal sub-components (e.g., spinners, icons) — private, not exported
function InternalPart() { ... }

// 6. Props interface — extend the HTML element's attributes + VariantProps
export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // Additional semantic props here
  loading?: boolean
}

// 7. The component — forwardRef always for DOM elements
export const ComponentName = React.forwardRef<HTMLElement, ComponentNameProps>(
  ({ className, variant, size, ...props }, ref) => (
    <element
      ref={ref}
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  )
)
ComponentName.displayName = 'ComponentName'
```

### What not to put in a component file

- Default export (always named exports)
- Business logic, API calls, context reads
- Hardcoded color values or pixel sizes not from the token system
- Comments describing what the code does (name things well instead)

---

## 4. Token Usage Reference

When you need a value, reach for these in this order:

1. **Tailwind utility class** — covers 95% of cases. Utilities map directly to `tailwind.config.ts`.
   ```
   bg-teal-500   text-sand-700   rounded-md   shadow-teal   tracking-wide
   ```

2. **CSS variable** — for properties Tailwind can't express directly (gradients, multi-stop animations, custom properties passed to children).
   ```css
   color: var(--fg2);
   box-shadow: var(--shadow-teal);
   transition-timing-function: var(--ease-out);
   ```

3. **Arbitrary Tailwind value** — last resort, only when a token exists but has no utility class.
   ```
   duration-[var(--dur-base)]   ease-[var(--ease-out)]
   ```

Never use raw hex values, pixel values outside the spacing scale, or Tailwind colors not in `tailwind.config.ts` (e.g., `bg-blue-500`).

---

## 5. Storybook Story Structure

Every component ships with a story file at:
```
src/stories/components/ComponentName.stories.tsx
```

Stories follow this order:

```
Default        — Single interactive story driven by Controls. Uses `args`.
AllVariants    — render() fn, one of each variant side-by-side.
Sizes          — render() fn, one of each size.
WithSlots      — render() fn showing icon/children composition patterns.
States         — render() fn: loading, disabled, error — whatever applies.
Matrix         — render() fn: full variant × size grid.
```

The `Default` story is the only one that uses `args` and `argTypes`. All other stories use `render()` and are static — they show real combinations, not synthetic control states.

**argTypes to always define:**
- `variant` → `control: 'select'`
- `size` → `control: 'select'`
- `disabled` → `control: 'boolean'`
- `loading` → `control: 'boolean'` (if the component has it)
- `children` → `control: 'text'` (if applicable)

**Parameters:**
- Always set `parameters: { layout: 'padded' }` on the meta so stories have breathing room.
- Background defaults to `cream` (set in `.storybook/preview.ts`). Add a `charcoal` background story variant for light-text components.

---

## 6. Props Conventions

| Pattern | Convention |
|---|---|
| Slot props (icons, leading/trailing elements) | `leftIcon`, `rightIcon`, `adornment` — always `React.ReactNode` |
| Loading state | `loading?: boolean` — shows spinner, disables, sets `aria-busy` |
| Size dimension | `size?: 'sm' \| 'md' \| 'lg'` — default `'md'` |
| Semantic variant | `variant?: 'primary' \| 'secondary' \| 'ghost' \| 'danger'` |
| Forwarded ref | Always — no exceptions for DOM-facing components |
| className override | Always spread after CVA output: `cn(variants(...), className)` |
| HTML attribute passthrough | Always spread `...props` on the root element |

---

## 7. Manual Component Development Flow

This is the repeatable sequence for building a component without AI help. Each step has a clear exit condition before moving to the next.

### Step 1 — Define the component's contract (5 min)

Write the props interface and default export signature only. No implementation yet.

Questions to answer:
- What HTML element is the root? (Determines which `React.HTMLAttributes<T>` to extend)
- What are the variant dimensions? (List them — these become CVA keys)
- What slot props does it need? (Composition points)
- What interactive states does it have? (loading, disabled, error, active)

Exit condition: you can write `ComponentNameProps` in full without looking anything up.

### Step 2 — Map tokens to states (10 min)

Open `tailwind.config.ts` and `globals.css`. For each variant and state, write down the exact Tailwind class or CSS variable. Do this on paper or in a scratch comment — not in the component file yet.

Example mapping for a secondary button:
```
default:  border-teal-500 text-teal-600
hover:    bg-teal-50
active:   bg-teal-100 border-teal-600
disabled: opacity-40 (applied via base)
focus:    shadow-ring (applied via base)
```

Exit condition: every state for every variant has a token mapped. No blanks.

### Step 3 — Write CVA (10 min)

Write the `cva()` call first, before any JSX. Test in isolation by calling `componentVariants({ variant: 'primary', size: 'md' })` mentally and verifying the output class string makes sense.

Check for conflicts: if the same property (e.g., `text-*`) appears in both base and a variant, that's fine — `twMerge` resolves it. Document it with a short inline note only if the resolution is non-obvious.

Exit condition: all variants × sizes produce a valid, non-contradictory class string.

### Step 4 — Write the JSX (10 min)

Implement the render. Keep it flat — one root element, slots as children. Internal sub-components (spinners, icons) are private functions in the same file.

Order inside the render:
1. `ref` forwarding
2. `className` via `cn(variants(...), className)`
3. ARIA attributes
4. Spread `...props`
5. Slot rendering (leftIcon → children → rightIcon)

Exit condition: component renders without errors in isolation.

### Step 5 — Export and index (2 min)

Add named exports to `src/index.ts`:
```ts
export { ComponentName } from './components/ComponentName'
export type { ComponentNameProps } from './components/ComponentName'
```

Run `pnpm typecheck`. Fix any errors before continuing.

Exit condition: `pnpm typecheck` exits clean.

### Step 6 — Write stories (15 min)

Write stories in the order defined in Section 5. Start with `Default` (args + argTypes), then static stories.

Storybook-specific checks:
- Does `Default` show the component in its most common use case?
- Does `AllVariants` show every branch of the `variant` prop?
- Does `Matrix` expose any visual regressions between size × variant combos?
- Does a dark background story exist if the component has a light-text variant?

Exit condition: Storybook renders all stories without console errors. Every variant is visually verifiable.

### Step 7 — Visual review in Storybook (10 min)

Run `pnpm storybook` and check every story.

Checklist:
- [ ] Colors match the token spec (no unintended grays or default browser blues)
- [ ] Focus ring appears on keyboard navigation (Tab into the component)
- [ ] Disabled state is visually distinct and not interactive
- [ ] Loading state shows spinner and freezes interaction
- [ ] Hover and active states have distinct visual feedback
- [ ] Component looks correct on both `cream` and `charcoal` backgrounds (switch in Storybook toolbar)
- [ ] Text does not overflow or wrap unexpectedly at any size

Exit condition: all checklist items pass. No console errors or warnings.

---

## 8. Common Mistakes

**Using Tailwind colors outside the config.**
`bg-blue-500` will not generate a utility class because `blue` is not in `tailwind.config.ts`. Check the config before using any color.

**Putting interaction logic in CVA.**
CVA is for static visual states. Don't compute variant values dynamically (`variant={isActive ? 'primary' : 'ghost'}`). The caller does that — the component receives a resolved prop.

**Forgetting `twMerge` behavior.**
`cn('px-4', 'px-6')` resolves to `px-6`. This is intentional — callers override via `className`. Don't fight it by using `!important` or inline styles.

**Skipping `forwardRef`.**
All DOM-facing components must use `forwardRef`. This allows forms, animation libraries, and focus management to work correctly.

**Growing props instead of composing.**
If you find yourself adding `showLeadingIcon`, `showTrailingIcon`, `iconName` props — stop. Accept `leftIcon: React.ReactNode` and let the caller pass an `<svg>`.

**Not setting `displayName`.**
`React.forwardRef` produces anonymous components in DevTools. Always set `ComponentName.displayName = 'ComponentName'`.
