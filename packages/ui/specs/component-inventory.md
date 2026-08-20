# @atlora/ui — Component Inventory

A checklist of every component the design system needs, with the props each one takes. Use this to track progress — check items off as you build them manually following the workflow in `components-spec.md`.

Status legend: ✅ Done · 🚧 Not started
Priority: **P0** blocks web/admin CRUD screens now · **P1** needed once those screens grow · **P2** later (portal, messaging, billing)

Every component below now lists **Variants** (the CVA dimensions and their exact value sets — per `components-spec.md` §2, two or more of these means reach for `cva()`) and **States** (the non-variant conditions — hover/focus/disabled/loading/error/etc. — that need a token mapped per `components-spec.md` §7 Step 2, even though they aren't props you branch on directly).

---

## 1. Primitives

Generic, app-agnostic building blocks. No knowledge of Atlora's domain models.

### Button — ✅ Done
`src/components/Button.tsx`.
```ts
variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
colorScheme?: 'brand' | 'premium' | 'warm' | 'calm' | 'neutral'
size?: 'sm' | 'md' | 'lg'
```
**Variants:** `variant` × `colorScheme` × `size` — 3 independent dimensions, CVA `compoundVariants` (note `danger` is colorScheme-invariant, always semantic red).
**States:** default, hover, active/pressed, focus-visible, disabled, loading (spinner replaces `leftIcon`, `aria-busy`).

### Input — ✅ Done
`src/components/Input.tsx`. Root: `input`. One varying dimension (`size`) → `cn()`, not CVA.
```ts
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'          // default 'md'
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```
Note: `React.InputHTMLAttributes` already declares a native `size` (the HTML character-width attribute, typed `number`) — it must be `Omit`'d before redeclaring `size` as the variant union, or TS2430 fires.
**Variants:** `size: sm | md | lg`.
**States:** default, hover, focus-visible, disabled, read-only, `error` (border/ring turns danger regardless of focus state), filled vs. placeholder (visual only, not a prop).

### Textarea — ✅ Done
`src/components/Textarea.tsx`. Root: `textarea`.
```ts
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  autoResize?: boolean
}
```
**Variants:** `size: sm | md | lg` — keep in sync with `Input` so the two visually pair in a form.
**States:** default, hover, focus-visible, disabled, read-only, `error`, resizing (if `autoResize` is off, native resize handle stays visible — decide whether to suppress it).

### Select — ✅ Done
`src/components/Select.tsx`. Native `<select>` wrapper (not a listbox/combobox — see Combobox below for that).
```ts
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}
```
Same `size` collision as `Input` — `SelectHTMLAttributes.size` is the native visible-rows `number`. `Omit` it first.
**Variants:** `size: sm | md | lg`.
**States:** default, hover, focus-visible, disabled, `error`, placeholder option selected (dim text) vs. real value selected.

### Checkbox — ✅ Done
`src/components/Checkbox.tsx`. Went with a visually-hidden native `input[type=checkbox]` (`peer`) plus a custom sibling box driven by `peer-checked:`/`hover:`/`focus-visible:` — keeps native keyboard/screen-reader semantics instead of reimplementing them via `button[role=checkbox]`. `indeterminate` isn't a real HTML attribute, so it's set imperatively on the DOM node via a `ref` + `useEffect`, and rendered as its own always-on overlay (not a CSS peer state) since `:indeterminate` styling can't reliably layer with `:checked`.
```ts
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  indeterminate?: boolean
}
```
**Variants:** none (single visual treatment) — do not add a `size`/`variant` prop unless a second surface actually needs one; a lone `indeterminate` boolean stays a `cn()` conditional, not CVA.
**States:** unchecked, checked, indeterminate, hover, focus-visible, disabled (× each of the above — disabled+checked must stay visually distinct from disabled+unchecked).

### RadioGroup — ✅ Done
`src/components/RadioGroup.tsx`.
```ts
interface RadioOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}
interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'   // default 'vertical'
}
```
**Variants:** `orientation: horizontal | vertical`.
**States:** per-option: unselected, selected, hover, focus-visible, disabled.

### Switch — ✅ Done
`src/components/Switch.tsx`. Track height/width and thumb travel distance use arbitrary rem values (`h-[1.25rem]` etc.), not `h-<n>` — same reasoning as the `control-*` height/padding tokens: raw numeric spacing keys 1–9 are unsafe here.
```ts
interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'sm' | 'md'
}
```
**Variants:** `size: sm | md`.
**States:** off, on, hover, focus-visible, disabled (× off/on), transitioning (thumb slide — covered by `transition-all`, not a discrete state).

### Badge — ✅ Done
`src/components/Badge.tsx`. Status pills — reused everywhere (`Status`, `PublishStatus`, `EngagementStatus`, `BookingStatus`...). Two dimensions → CVA.
```ts
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'subtle' | 'outline'   // default 'subtle'
  colorScheme?: 'brand' | 'premium' | 'warm' | 'calm' | 'neutral' | 'success' | 'danger'
  size?: 'sm' | 'md'
}
```
**Variants:** `variant` × `colorScheme` × `size` — 3 × 7 × 2 = 42 combinations; use `compoundVariants` only where `variant`+`colorScheme` need a non-formulaic override (e.g. `success`/`danger` may want fixed colors regardless of theme), otherwise derive `subtle`/`outline`/`solid` from the same colorScheme token programmatically.
**States:** static display only — no hover/focus/disabled (not interactive). If `Tag` composes `Badge` with `onRemove`, the states live on `Tag`, not here.

### Avatar — ✅ Done
`src/components/Avatar.tsx`.
```ts
interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null
  alt?: string
  fallback?: string          // initials, derived by caller
  size?: 'xs' | 'sm' | 'md' | 'lg'
}
```
**Variants:** `size: xs | sm | md | lg`.
**States:** image loaded, image failed to load (falls back to `fallback` initials), no `src` provided (initials or generic icon), loading (optional skeleton pulse while `src` resolves).

### Tag / Chip — ✅ Done
`src/components/Tag.tsx`. Dismissible label — used for `TripStyle`, `ClientTag`, `Specialty` filters.
```ts
interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void       // renders a dismiss (x) button when present
  colorScheme?: 'brand' | 'neutral'
}
```
**Variants:** `colorScheme: brand | neutral` — one dimension, `cn()` lookup, not CVA.
**States:** default, hover, removable (dismiss icon shown when `onRemove` present) with its own hover/focus-visible, disabled.

### Tooltip — ✅ Done
`src/components/Tooltip.tsx`.
```ts
interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  side?: 'top' | 'right' | 'bottom' | 'left'   // default 'top'
  delayMs?: number                              // default 200
}
```
**Variants:** `side: top | right | bottom | left` (placement, not a visual variant — same styling, different position + arrow orientation).
**States:** hidden, entering (after `delayMs`), visible, exiting.

### Card — ✅ Done
`src/components/Card.tsx`. Generic surface — `DestinationCard` etc. compose on top of this instead of redefining `rounded-lg border bg-white shadow-sm` each time.
```ts
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'   // default 'md'
  hoverable?: boolean                      // adds hover:shadow-md transition
}
```
**Variants:** `padding: none | sm | md | lg` — single dimension, `cn()`. `hoverable` is a boolean toggle, not a CVA dimension on its own.
**States:** default, hover (only if `hoverable`), focus-visible (only if the card itself is made interactive/clickable by a caller — don't bake `tabIndex` in here).

### Divider — ✅ Done
`src/components/Divider.tsx`.
```ts
interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical'   // default 'horizontal'
}
```
**Variants:** `orientation: horizontal | vertical`.
**States:** none — purely decorative, never interactive.

### Spinner — ✅ Done
`src/components/Spinner.tsx`. Extracted from `Button`'s private `Spinner` (`Button` now imports it) so `Table`, `Modal`, page-level loading states can reuse it.
```ts
interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg'
}
```
**Variants:** `size: sm | md | lg`.
**States:** none beyond the animation itself (always spinning while mounted).

### Skeleton — ✅ Done
`src/components/Skeleton.tsx`.
```ts
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rect'   // default 'rect'
}
```
**Variants:** `variant: text | circle | rect` — single dimension.
**States:** pulsing (default) — consider a `static` prop later only if a non-animated placeholder is ever needed; don't add it speculatively now.

---

## 2. Layout & Navigation

### Container — 🚧 P1
```ts
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'full'   // max-width presets
}
```
**Variants:** `size: sm | md | lg | full`.
**States:** none — pure layout primitive.

### Tabs — 🚧 P0
Admin uses this constantly (Trip editor, Client detail, Destination editor tabs).
```ts
interface TabItem {
  value: string
  label: React.ReactNode
  disabled?: boolean
}
interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'   // default 'horizontal'
  children: React.ReactNode   // TabPanel per item, matched by value
}
```
**Variants:** `orientation: horizontal | vertical`.
**States:** per-tab: inactive, active, hover, focus-visible, disabled.

### Breadcrumbs — 🚧 P1
```ts
interface BreadcrumbItem {
  label: string
  href?: string   // last item omits href (current page)
}
interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
}
```
**Variants:** none.
**States:** per-crumb: link (hover/focus-visible), current page (no `href`, non-interactive, visually muted or bolded per token spec).

### Pagination — 🚧 P0
Every admin list view (`Client`, `Trip`, `Destination`, `Inquiry`) needs this.
```ts
interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  siblingCount?: number   // default 1
}
```
**Variants:** none.
**States:** page button — default, active/current, hover, focus-visible; prev/next — enabled, disabled (at bounds).

### DropdownMenu — 🚧 P0
Row actions in admin tables (Edit / Archive / Delete).
```ts
interface DropdownMenuItem {
  label: React.ReactNode
  onSelect: () => void
  destructive?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}
interface DropdownMenuProps {
  trigger: React.ReactElement
  items: DropdownMenuItem[]
  align?: 'start' | 'end'   // default 'end'
}
```
**Variants:** `align: start | end` (placement, not visual).
**States:** menu — closed, open; item — default, `destructive` (danger color), hover, focus-visible (keyboard nav), disabled.

### Accordion — 🚧 P1
Trip itinerary day-by-day view, FAQ sections on marketing pages.
```ts
interface AccordionItem {
  value: string
  trigger: React.ReactNode
  content: React.ReactNode
}
interface AccordionProps {
  items: AccordionItem[]
  type?: 'single' | 'multiple'   // default 'single'
  defaultValue?: string | string[]
}
```
**Variants:** `type: single | multiple` (behavioral, not visual — governs whether opening one item closes the others).
**States:** per-item trigger — collapsed, expanded, hover, focus-visible, disabled.

### SidebarNav — 🚧 P0
Admin app shell — top-level nav (Destinations, Trips, Clients, Inquiries...).
```ts
interface SidebarNavItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: React.ReactNode    // e.g. unread inquiry count
}
interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[]
  activeHref: string
  collapsed?: boolean   // icon-only rail mode
}
```
**Variants:** `collapsed: boolean` (icon-only rail vs. full label list) — treat as a single-dimension `cn()` toggle, not CVA.
**States:** per-item: inactive, active (`activeHref` match), hover, focus-visible.

---

## 3. Overlays & Feedback

### Dialog / Modal — 🚧 P0
Confirm delete, quick-create forms.
```ts
interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'   // default 'md'
}
```
**Variants:** `size: sm | md | lg`.
**States:** closed, entering, open, exiting (plus overlay/backdrop opacity paired to each).

### AlertDialog — 🚧 P0
Destructive confirmation (archive `Trip`, delete `Client`) — distinct from `Dialog` because it forces an explicit confirm/cancel choice.
```ts
interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  confirmLabel?: string       // default 'Confirm'
  cancelLabel?: string        // default 'Cancel'
  onConfirm: () => void
  destructive?: boolean       // renders confirm button with danger variant
  loading?: boolean
}
```
**Variants:** `destructive: boolean` — maps confirm button to `Button`'s `variant="danger"` vs. `variant="primary"`; not a CVA dimension here, just a prop passthrough.
**States:** default, `loading` (confirm button shows spinner, both buttons disabled), disabled (while `loading`).

### Drawer / Sheet — 🚧 P1
Side panel for row detail (Client detail, Inquiry detail) without leaving the list.
```ts
interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: 'right' | 'left'   // default 'right'
  size?: 'sm' | 'md' | 'lg'
  title?: React.ReactNode
  children: React.ReactNode
}
```
**Variants:** `side: right | left` × `size: sm | md | lg`.
**States:** closed, entering (slide-in), open, exiting (slide-out).

### Popover — 🚧 P1
Generic anchored panel — filter builders, date range pickers sit inside this.
```ts
interface PopoverProps {
  trigger: React.ReactElement
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
```
**Variants:** `align: start | center | end` (placement, not visual).
**States:** closed, open — plus collision-flipped placement (top vs. bottom) if using a floating-positioning lib; document that as behavior, not a prop.

### Toast — 🚧 P0
Needs a `ToastProvider` + `useToast()` hook, not just a visual component.
```ts
interface ToastOptions {
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'   // default 'default'
  durationMs?: number                          // default 4000
}
// useToast().show(options: ToastOptions): void
```
**Variants:** `variant: default | success | error` — single dimension, `cn()` lookup keyed off `variant`.
**States:** entering, visible, exiting (auto-dismiss after `durationMs`, or manual dismiss via close icon — give every toast a close affordance, not just a timer).

### EmptyState — ✅ Done
`src/components/EmptyState.tsx`. Every list view needs this for the zero-results case (no trips yet, no clients yet, no search matches). `DataTable` uses it as the default `emptyState` fallback.
```ts
interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode   // typically a <Button>
}
```
**Variants:** none — resist adding a `variant` prop for "no results" vs. "error" vs. "no permission"; compose those differences via `icon`/`title`/`description`/`action`, not a growing enum.
**States:** none (static content block).

---

## 4. Forms

### FormField — ✅ Done
`src/components/FormField.tsx`. Wraps label + control + helper/error text so every form input doesn't hand-roll this layout.
```ts
interface FormFieldProps {
  label: string
  htmlFor: string
  helperText?: string
  error?: string
  required?: boolean
  children: React.ReactNode   // the Input/Select/Textarea/etc.
}
```
**Variants:** none — this is a layout wrapper, not a styled surface.
**States:** default (helperText shown), error (`error` string shown instead of helperText, label + child both flip to danger tone), required (asterisk/indicator on label).

### SearchInput — ✅ Done
`src/components/SearchInput.tsx`. `Input` + magnifier icon + debounced `onSearch`. Used on every catalog list and the (future) public discovery search. Renders `type="text"`, not `type="search"` — the latter's native browser cancel-button decoration would double up with the custom clear button.
```ts
interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch: (query: string) => void
  debounceMs?: number   // default 300
  onClear?: () => void
}
```
**Variants:** inherits `Input`'s `size` if you compose rather than reimplement — don't redeclare the dimension here.
**States:** empty, typing (debounce pending), has value (clear `x` button shown when `onClear` present), loading (optional, if the caller wants a spinner while results fetch).

### Combobox — 🚧 P1
Async/typeahead select — assigning a `Destination` to a `Trip`, picking a `Country` for a `Region`.
```ts
interface ComboboxOption<T = string> {
  value: T
  label: string
  description?: string
}
interface ComboboxProps<T = string> {
  options: ComboboxOption<T>[]
  value?: T
  onValueChange: (value: T) => void
  onInputChange?: (query: string) => void   // for async filtering
  loading?: boolean
  placeholder?: string
  emptyMessage?: string
}
```
**Variants:** none of its own — should visually match `Select`'s size scale if you want them to pair in a form; don't invent a separate size prop unless it's actually wired.
**States:** closed, open, `loading` (spinner in place of options list), empty (no options match — shows `emptyMessage`), option hover/focus (keyboard nav), option selected.

### DateRangePicker — 🚧 P1
`TripDeparture` dates, `Inquiry` start/end, discovery filters.
```ts
interface DateRangePickerProps {
  value?: { from: Date; to?: Date }
  onValueChange: (range: { from: Date; to?: Date } | undefined) => void
  minDate?: Date
  disabled?: boolean
}
```
**Variants:** none.
**States:** no selection, partial selection (`from` set, `to` pending — the "picking end date" hover-preview state), complete range, date-cell states (in-range, range-start, range-end, today, disabled/`< minDate`, hover, focus-visible).

### FileUpload / ImageUpload — 🚧 P1
Feeds `Media` records (R2-backed). Hero image + gallery uploads for `Destination`/`Region`/`Poi`/`Trip`.
```ts
interface FileUploadProps {
  accept?: string             // e.g. 'image/*'
  multiple?: boolean
  maxSizeMb?: number
  onFilesSelected: (files: File[]) => void
  uploading?: boolean
  progress?: number           // 0–100
}
```
**Variants:** none.
**States:** idle, drag-over (dropzone highlight), `uploading` (progress bar bound to `progress`), error (file too large / wrong type — surface via `FormField`'s `error`, don't duplicate error styling here), success.

### MultiSelect — ✅ Done
`src/components/MultiSelect.tsx`. Tag-style multi-pick — `TripStyle` selection, `SpecialtyTags`, `regionIds` on a Destination. Built without a `Combobox`/`Popover` dependency: selected values render as removable inline chips, and a plain native `<select>` at the end of the row is the "add another" affordance — trades a slightly less polished add-UX for zero new floating-positioning infra. Revisit once `Popover` exists.
```ts
interface MultiSelectOption {
  value: string
  label: string
}
interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onValueChange: (values: string[]) => void
  placeholder?: string
  maxItems?: number
}
```
**Variants:** none.
**States:** empty (shows `placeholder`), has selections (rendered as removable `Tag`s), open/closed dropdown, `maxItems` reached (remaining options disabled), option hover/focus/selected inside the open list.

---

## 5. Data Display

### DataTable — ✅ Done
`src/components/DataTable.tsx`. The backbone of the admin app — `Client`, `Trip`, `Destination`, `Inquiry`, `Booking` list views all use this. Purely controlled (no internal state) — `selectedKeys`/`onSelectionChange` and `sortKey`/`sortDirection`/`onSortChange` are all caller-owned, same pattern as `Pagination`.
```ts
interface DataTableColumn<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode   // default: String(row[key])
  width?: string
  sortable?: boolean
}
interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  loading?: boolean
  emptyState?: React.ReactNode
  onRowClick?: (row: T) => void
  selectable?: boolean
  selectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void
}
```
**Variants:** none — density/size is a candidate future dimension (`compact | comfortable`) but don't add it until an actual screen needs it.
**States:** `loading` (skeleton rows, not a spinner overlay — keeps layout stable), empty (renders `emptyState`, prefer an `EmptyState` instance), populated, row hover (only if `onRowClick`/`selectable`), row selected (only if `selectable`), column header sorted-asc/sorted-desc/unsorted (only if `sortable`).

### StatCard — 🚧 P1
Admin dashboard KPI tiles (open inquiries, active engagements, MTD bookings).
```ts
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: { direction: 'up' | 'down' | 'flat'; label: string }
  icon?: React.ReactNode
}
```
**Variants:** `trend.direction: up | down | flat` drives the trend indicator's color (`up` → success unless the metric is inverse, e.g. "declined inquiries"; caller decides, component just renders the direction it's given).
**States:** static — no hover/focus (not interactive) unless the whole card links out, in which case wrap it in a link and treat the wrapper's states, not this component's.

### ProgressBar — 🚧 P2
`TripDeparture` capacity (`booked` / `capacity`), file upload progress, plan usage (`UsageRecord` vs `limitValue`).
```ts
interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number        // 0–100
  colorScheme?: 'brand' | 'warm' | 'danger'
  showLabel?: boolean
}
```
**Variants:** `colorScheme: brand | warm | danger` — single dimension, `cn()` lookup (e.g. `danger` when a capacity/usage metric is near or over its limit).
**States:** 0% (empty track only), in-progress, complete (100% — consider whether `brand`/`warm` should auto-flip at completion or stay caller-controlled; keep it caller-controlled to avoid hidden logic).

### Rating — 🚧 P2
`DestinationSeason.rating`, review/testimonial display.
```ts
interface RatingProps {
  value: number       // 0–5, supports halves
  max?: number         // default 5
  size?: 'sm' | 'md'
  readOnly?: boolean
  onValueChange?: (value: number) => void
}
```
**Variants:** `size: sm | md`.
**States:** `readOnly` (display-only, no hover affordance) vs. interactive (hover preview per star, focus-visible per star, click to set `value`).

---

## 6. Catalog & Marketing Cards

Typed against `@atlora/types` where the Zod schema already exists (`packages/types/src/geography.ts`, `media.ts`). Where it doesn't exist yet, the prop shape below is provisional — align it with the real schema once it lands.

### DestinationCard — ✅ Done
`src/components/DestinationCard.tsx`. `{ destination: Destination }` from `@atlora/types`. Now composes `Card` (`padding="none"` + `hoverable`, with `overflow-hidden` and the `group` class layered on via `className`) instead of re-declaring the surface — per the §1 note that §6 cards should build on `Card`. Picked up `Card`'s default `rounded-md`/`border-sand-200` treatment in the process (was `rounded-lg`/`border-sand-300`).
**Variants:** none as explicit props — visual branch is driven entirely by data: `destination.status === 'DRAFT'` renders the "Coming Soon" eyebrow badge; `destination.country?.flagSvg` present/absent changes the eyebrow content; `hero` media present/absent switches image vs. `PlaceholderIcon`.
**States:** hover (image `scale-105` + card `shadow-md`), focus-visible (if wrapped in a link by the caller — the card itself has no root-level interactivity).

### RegionCard — 🚧 P0
Same visual family as `DestinationCard`. Type exists: `Region` in `@atlora/types`.
```ts
interface RegionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  region: Region   // from '@atlora/types'
}
```
**Variants:** data-driven, same pattern as `DestinationCard` — `region.status === 'DRAFT'` badge, hero media present/absent.
**States:** hover, focus-visible (same as `DestinationCard`).

### CountryChip — 🚧 P1
Small flag + name unit already inlined in `DestinationCard` (lines 72–82) — worth extracting so it's reused in filters and country pickers.
```ts
interface CountryChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  country: Country   // from '@atlora/types'
  size?: 'sm' | 'md'
}
```
**Variants:** `size: sm | md`.
**States:** default; if used inside `Combobox`/filter UI, hover/focus/selected belong to the parent list item, not this chip.

### PoiCard — 🚧 P1
Type exists: `Poi` in `@atlora/types`. Note the schema currently has no `media` field — either add one or pass hero media separately.
```ts
interface PoiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  poi: Poi                        // from '@atlora/types'
  heroMedia?: MediaAttachment     // until Poi carries its own media relation
  typeLabel?: string              // override the PoiType -> label mapping (HOTEL, ATTRACTION, RESTAURANT, AIRPORT, TRANSPORT_HUB, NEIGHBORHOOD)
}
```
**Variants:** data-driven by `poi.type` — each of the 6 `PoiType` values should map to a distinct icon/label, mirroring `DestinationCard`'s `DESTINATION_TYPE_LABELS` pattern.
**States:** `heroMedia` present/absent (image vs. placeholder), hover, focus-visible.

### TripCard — 🚧 P0
No `@atlora/types` schema yet (`Trip` isn't in `packages/types` — only `apps/api`/`packages/db` will define it). Provisional shape from `data_models.md` Domain 5:
```ts
interface TripCardProps extends React.HTMLAttributes<HTMLDivElement> {
  trip: {
    id: string
    slug: string
    title: string
    summary: string | null
    priceFrom: number | null
    currency: string
    durationDays: number | null
    status: 'DRAFT' | 'PUBLISHED'
    heroMediaUrl: string | null
    destinationNames: string[]   // resolved from TripDestination join
  }
}
```
**Variants:** `trip.status` drives the same draft badge treatment as `DestinationCard`; `priceFrom` present/absent toggles whether `PriceTag` renders or the card shows "Price on request".
**States:** hero image present/absent, hover, focus-visible.

### ArticleCard — 🚧 P2
Provisional — `Article` not yet in `packages/types`.
```ts
interface ArticleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  article: {
    slug: string
    title: string
    type: 'guide' | 'blog' | string
    summary: string | null
    heroMediaUrl: string | null
    publishedAt: string | null
  }
}
```
**Variants:** `article.type` drives an eyebrow label ("Guide" vs. "Blog") the same way `DESTINATION_TYPE_LABELS` does on `DestinationCard`.
**States:** `publishedAt` null (unpublished/scheduled — consider whether this should reuse the same draft badge pattern), hero image present/absent, hover, focus-visible.

### AgencyCard — 🚧 P1
Public discovery / marketplace listing. Provisional — `AgencyProfile` not yet in `packages/types`.
```ts
interface AgencyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  agency: {
    slug: string
    name: string
    headline: string | null
    logoUrl: string | null
    specialtyLabels: string[]    // resolved Specialty -> label
    consortiumName?: string      // e.g. 'Virtuoso'
  }
}
```
**Variants:** `consortiumName` present/absent toggles a trust badge; no ranking-tier variant per `data_models.md` Domain 6 — "there is deliberately no `boostAmount`/`sponsoredUntil`", so don't add a `featured`/`promoted` visual variant here either.
**States:** logo present/absent (fallback to `Avatar`-style initials), hover, focus-visible.

### AdvisorCard — 🚧 P1
Provisional — `AdvisorProfile` not yet in `packages/types`.
```ts
interface AdvisorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  advisor: {
    slug: string
    displayName: string
    headline: string | null
    photoUrl: string | null
    yearsExperience: number | null
    specialtyLabels: string[]
  }
}
```
**Variants:** none beyond data presence — same photo/fallback treatment as `AgencyCard`'s logo.
**States:** photo present/absent, hover, focus-visible.

### PriceTag — 🚧 P1
Reused by `TripCard`, `TripDeparture` rows, `Booking` summaries.
```ts
interface PriceTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number
  currency: string     // ISO 4217
  fromPrice?: boolean  // renders a "from" prefix
  size?: 'sm' | 'md' | 'lg'
}
```
**Variants:** `size: sm | md | lg` × `fromPrice: boolean` (prefix toggle, not a CVA dimension — just conditional text).
**States:** none — static display.

### TestimonialCard — 🚧 P2
Marketing site social proof. No backing model yet — likely sourced from `Article` or a future `Review` model.
```ts
interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  quote: string
  authorName: string
  authorPhotoUrl?: string
  rating?: number   // 0–5
}
```
**Variants:** `rating` present/absent toggles whether `Rating` (read-only) renders.
**States:** `authorPhotoUrl` present/absent (fallback to `Avatar` initials).

---

## 7. Status & Trip-Hub Components

### StatusBadge — ✅ Done
`src/components/StatusBadge.tsx`. Thin `Badge` preset mapping domain status enums (`PublishStatus`, `EngagementStatus`, booking/payment status) to a `colorScheme` + label, so callers never hand-pick colors per status.
```ts
interface StatusBadgeProps {
  status: string          // see the enum sets below
  labelMap?: Record<string, string>   // override default label text
  size?: 'sm' | 'md'
}
```
**Variants:** `size: sm | md`, passed straight through to `Badge`. The real variance is the internal `status → colorScheme` lookup table — enumerate every status set it needs to cover before building it, so the map is exhaustive on day one:
- `PublishStatus` (`packages/types`): `DRAFT` → neutral/subtle, `PUBLISHED` → success/solid.
- `EngagementStatus` (`data_models.md` Domain 4): `INQUIRY` → neutral, `ACTIVE` → brand, `BOOKED` → success, `ARCHIVED` → neutral/outline.
- `InquiryRecipient.status` (Domain 7): `PENDING` → neutral, `VIEWED` → calm, `RESPONDED` → brand, `DECLINED`/expired → danger.
- `TripDeparture.status` (Domain 5, provisional): `OPEN` → success, `FULL` → warm, `CANCELLED` → danger.
- `Booking`/`Payment`/`Commission` status fields aren't enumerated yet in `data_models.md` — leave `labelMap`-driven fallback (unrecognized status → neutral) instead of guessing a set now.
**States:** static — no hover/focus (not interactive).

### ItineraryDayCard — 🚧 P2
`ItineraryDay` + its `ItineraryItem[]`. No `packages/types` schema yet.
```ts
interface ItineraryDayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  dayNumber: number
  date: string | null
  destinationName?: string
  title: string | null
  items: Array<{
    id: string
    type: 'LODGING' | 'ACTIVITY' | 'TRANSPORT' | 'FLIGHT' | 'MEAL' | 'NOTE' | 'FREE_TIME'
    startTime?: string
    endTime?: string
    title: string
    notes?: string
  }>
}
```
**Variants:** each `item.type` (7 values) should map to a distinct icon — build this lookup table alongside the component, same pattern as `PoiCard`'s type labels.
**States:** collapsed/expanded (if wrapped in `Accordion`), item hover/focus if items are individually clickable (e.g. to edit).

### TripDepartureRow — 🚧 P2
```ts
interface TripDepartureRowProps extends React.HTMLAttributes<HTMLDivElement> {
  startDate: string
  endDate: string
  capacity: number
  booked: number
  price: number
  currency: string
  status: 'OPEN' | 'FULL' | 'CANCELLED' | string
}
```
**Variants:** `status: OPEN | FULL | CANCELLED` drives `StatusBadge` colorScheme (see the mapping above) — don't duplicate that lookup here.
**States:** `booked / capacity` feeds `ProgressBar`'s `colorScheme` (e.g. `danger` once `booked >= capacity * 0.9`), hover/focus-visible if the row is clickable.

### ClientListItem — 🚧 P1
Row in the CRM pipeline view. Provisional — `Client` not yet in `packages/types`.
```ts
interface ClientListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  firstName: string
  lastName: string
  email: string | null
  stage: string             // Client.stage — agency-defined vocabulary, no fixed enum in data_models.md yet
  ownerAdvisorName?: string
  hasProfile: boolean       // travelerProfileId != null
}
```
**Variants:** `stage` feeds `StatusBadge`, but unlike the enums above, `Client.stage` has no fixed value set in `data_models.md` — treat it as agency-configurable and rely on `StatusBadge`'s `labelMap`/fallback path rather than a hardcoded lookup.
**States:** `hasProfile: boolean` toggles a "claimed"/"unclaimed" indicator (see `ClientClaim` in `data_models.md` Domain 4), hover, focus-visible.

### InquiryCard — 🚧 P2
Agency-side inbox item for a routed `Inquiry`.
```ts
interface InquiryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  travelerName: string
  destinationNames: string[]
  startDate: string | null
  endDate: string | null
  partySize: number
  budgetTier?: string
  status: 'PENDING' | 'VIEWED' | 'RESPONDED' | 'DECLINED' | string
  sentAt: string
}
```
**Variants:** `status` feeds `StatusBadge` (same `InquiryRecipient.status` mapping above).
**States:** unread vs. read (likely derived from `status !== 'PENDING'` rather than a separate prop), hover, focus-visible.

---

## Not started at all yet, worth building first

The full form-input set is now done: **Input**, **Select**, **Textarea**, **Checkbox**, **RadioGroup**, **Switch**, **FormField**, **SearchInput**, **MultiSelect** — every primitive needed to build a CRUD form exists. All of §1 Primitives is now done too: **Badge**, **Avatar**, **Tag/Chip**, **Tooltip**, **Card**, **Divider**, **Spinner**, **Skeleton**. `DestinationCard` now composes `Card` instead of re-declaring the surface. **StatusBadge**, **EmptyState**, and **DataTable** are done — the three highest-leverage components for the admin list-view screens. **Combobox** and **DateRangePicker** are still outstanding from §4 — both need a `Popover` primitive first (anchored floating positioning), which doesn't exist yet. **FileUpload**/**ImageUpload** is also outstanding but self-contained (no `Popover` dependency).

If you're picking a handful to build manually next, this is the highest-leverage order — each one unblocks several screens at once and none of them depend on a `packages/types` schema that doesn't exist yet:

1. **Dialog** / **AlertDialog** — needed as soon as you build a delete/archive action; `DataTable` row actions will want this next.
2. **Popover** — once you need it (for `Combobox`/`DateRangePicker`, or a filter panel), decide then whether to hand-roll positioning or add `@floating-ui/react`. Reuse the `w-max` fix from `Tooltip` (`src/components/Tooltip.tsx`) — an absolutely-positioned panel inside a trigger-sized `relative` wrapper needs it or the panel collapses to a narrow column.
3. **Toast** — needs a `ToastProvider` + `useToast()` hook, not just a visual component; worth pairing with `Dialog`/`AlertDialog` since both are P0 overlays.
4. **SidebarNav** / **Tabs** / **Pagination** — the remaining §2 P0s that round out the admin app shell.
