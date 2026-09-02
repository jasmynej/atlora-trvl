import { NavLink, Outlet } from 'react-router-dom'

// No dedicated Tabs primitive exists in @atlora/ui yet — this mirrors the
// NavLink styling Shell.tsx already uses for the sidebar, just laid out
// horizontally. Worth promoting to a real @atlora/ui component once
// Milestone 2 gives these pages actual content and the pattern proves out.
function joinClassNames(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

const CATALOG_TABS = [
  { to: 'destinations', label: 'Destinations' },
  { to: 'regions', label: 'Regions' },
  { to: 'countries', label: 'Countries' },
  { to: 'poi', label: 'Points of Interest' },
] as const

export function CatalogLayout() {
  return (
    <div className="flex flex-col gap-4">
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

      <Outlet />
    </div>
  )
}
