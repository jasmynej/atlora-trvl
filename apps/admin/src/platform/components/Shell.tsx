import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '@atlora/ui'
import { usePlatformAuth } from '../lib/auth'
import atloraLogoMark from '../../assets/atlora-logo-mark.png'

// @atlora/ui doesn't export its internal `cn` helper — this is the one
// callsite here that needs a conditional class, so a plain join is enough
// rather than reaching into the package's internals.
function joinClassNames(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

const NAV_ITEMS = [
  { to: '/catalog', label: 'Catalog' },
  { to: '/agencies', label: 'Agencies' },
  { to: '/billing', label: 'Billing' },
  { to: '/audit-log', label: 'Audit Log' },
] as const

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = usePlatformAuth()

  return (
    <div className="flex min-h-screen bg-sand-100">
      <aside className="flex w-56 shrink-0 flex-col gap-1 border-r border-sand-200 bg-white p-4">
        <div className="mb-4 flex items-center gap-2 px-2">
          <img src={atloraLogoMark} alt="" className="h-7 w-7 shrink-0" />
          <p className="type-caption font-semibold uppercase tracking-wide text-brand-fg">Atlora Platform</p>
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              joinClassNames(
                'rounded px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-subtle text-brand-fg' : 'text-sand-600 hover:bg-sand-150 hover:text-charcoal'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-sand-200 bg-white px-6 py-3">
          <div />
          <div className="flex items-center gap-3">
            {user && (
              <span className="type-caption text-sand-600">
                {user.name} · {user.role === 'platform_admin' ? 'Admin' : 'Editor'}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={() => void logout()}>
              Sign out
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
