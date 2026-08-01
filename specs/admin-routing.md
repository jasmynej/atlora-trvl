# Admin Routing

`apps/admin` uses **react-router-dom v6** with `createBrowserRouter`. Routes are declared in a single file (`src/routes.tsx`) and injected into the app via `<RouterProvider>` in `main.tsx`.

---

## File layout

```
src/
├── main.tsx          ← mounts <RouterProvider>
├── routes.tsx        ← all route definitions live here
├── layouts/
│   └── AppLayout.tsx ← shell with nav/sidebar shared by authenticated pages
└── pages/
    ├── Dashboard.tsx
    ├── Trips.tsx
    └── trips/
        └── TripDetail.tsx   ← nested under /trips/:id
```

**Rule:** one file per page, one folder per nested group. No routing logic inside page components.

---

## How routes are declared (`src/routes.tsx`)

```tsx
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Trips from './pages/Trips'
import TripDetail from './pages/trips/TripDetail'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,       // layout wraps all children
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'trips', element: <Trips /> },
      { path: 'trips/:id', element: <TripDetail /> },
    ],
  },
])
```

---

## How the router is mounted (`src/main.tsx`)

```tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

// Inside <Root> (the tRPC/QueryClient provider wrapper):
<RouterProvider router={router} />
```

The full provider order is:

```
<trpc.Provider>
  <QueryClientProvider>
    <RouterProvider router={router} />
  </QueryClientProvider>
</trpc.Provider>
```

---

## Adding a new route

### 1. Create the page component

Add `src/pages/YourPage.tsx`:

```tsx
export default function YourPage() {
  return <div>Your Page</div>
}
```

### 2. Register it in `src/routes.tsx`

```tsx
import YourPage from './pages/YourPage'

// inside the children array of the AppLayout route:
{ path: 'your-path', element: <YourPage /> },
```

That's it. The page is now live at `/your-path`.

---

## Nested routes

For pages that share a sub-layout (e.g. a trip detail view with its own tabs):

```tsx
// routes.tsx
{
  path: 'trips/:id',
  element: <TripLayout />,      // sub-layout with tabs
  children: [
    { index: true, element: <TripOverview /> },
    { path: 'itinerary', element: <TripItinerary /> },
  ],
}
```

`TripLayout` must render `<Outlet />` where children should appear.

---

## Reading route params

```tsx
import { useParams } from 'react-router-dom'

export default function TripDetail() {
  const { id } = useParams<{ id: string }>()
  const { data } = trpc.trips.getById.useQuery({ id: id! })
}
```

---

## Navigating between routes

```tsx
import { Link, useNavigate } from 'react-router-dom'

// Declarative
<Link to="/trips">Trips</Link>

// Programmatic
const navigate = useNavigate()
navigate(`/trips/${trip.id}`)
```

---

## Route summary

| Path | Page | Notes |
|---|---|---|
| `/` | `Dashboard` | index route — rendered for exact `/` |
| `/trips` | `Trips` | list view |
| `/trips/:id` | `TripDetail` | detail view, param `id` |

Update this table whenever a route is added or removed.
