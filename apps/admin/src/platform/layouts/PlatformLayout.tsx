import { UserButton } from '@clerk/clerk-react'
import { NavLink, Outlet } from 'react-router-dom'
import { trpc } from '../../lib/trpc'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  const base = 'type-label rounded px-3 py-2 text-fg2 transition-colors hover:bg-sand-150 hover:text-fg1'
  return isActive ? `${base} bg-sand-200 text-fg1` : base
}

const NAV_ITEMS = [
  { to: '/platform', label: 'Catalog', end: true },
  { to: '/platform/agencies', label: 'Agencies' },
  { to: '/platform/billing', label: 'Billing' },
  { to: '/platform/audit-log', label: 'Audit Log' },
]

export default function PlatformLayout() {
  const { data: me } = trpc.platformUsers.me.useQuery()

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="w-56 shrink-0 border-r border-border bg-surface">
        <div className="type-eyebrow px-5 py-5">Atlora Platform</div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClassName}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
          <div className="type-body-sm text-fg2">
            {me ? `${me.name} · ${me.role.replace('platform_', '')}` : null}
          </div>
          <UserButton />
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
