import { createBrowserRouter } from 'react-router-dom'
import PlatformLayout from './layouts/PlatformLayout'
import Catalog from './pages/Catalog'
import Agencies from './pages/Agencies'
import Billing from './pages/Billing'
import AuditLog from './pages/AuditLog'

export const router = createBrowserRouter([
  {
    path: '/platform',
    element: <PlatformLayout />,
    children: [
      { index: true, element: <Catalog /> },
      { path: 'agencies', element: <Agencies /> },
      { path: 'billing', element: <Billing /> },
      { path: 'audit-log', element: <AuditLog /> },
    ],
  },
])
