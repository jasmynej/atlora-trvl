import { NavLink, Outlet } from 'react-router-dom'

// No dedicated Tabs primitive exists in @atlora/ui yet — this mirrors the
// NavLink styling Shell.tsx already uses for the sidebar, just laid out
// horizontally. Worth promoting to a real @atlora/ui component once
// Milestone 2 gives these pages actual content and the pattern proves out.
function joinClassNames(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

const CATALOG_TABS = [
    { to: 'countries', label: 'Countries' },
    { to: 'regions', label: 'Regions' },
    { to: 'destinations', label: 'Destinations' },
    { to: 'poi', label: 'Points of Interest' },
] as const

export function CatalogLayout() {
  return (
    <div className="flex flex-col">
      {/* `main` (the scroll container) has `p-6` padding, but that padding
          isn't a persistent inset — once scrolled, it's just more content
          that scrolls away, so table rows slide up through it and appear
          above a plain `sticky top-0` nav. `-mt-6` pulls this box's natural
          (unscrolled) position up to main's true clip edge, and `top-[-2rem]`
          lowers the stick threshold to match, so it's pinned there — covering
          that band with its own background — from the very first pixel of
          scroll, with no gap during the transition. `pt-6` then pushes the
          nav itself back down to its original spot, so nothing visibly moves.
          `pb-4` does the same job for the gap below the nav, which is
          otherwise a plain (uncovered) flex `gap`. */}
      <div className="sticky top-[-2rem] z-10 -mt-6 bg-sand-100 pb-4 pt-6">
        <nav className="flex gap-1 border-b border-sand-200">
          {CATALOG_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                joinClassNames(
                  'border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-brand text-brand-fg'
                    : 'border-transparent text-sand-600 hover:text-charcoal'
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <Outlet />
    </div>
  )
}
