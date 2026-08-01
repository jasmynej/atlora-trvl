# Atlora Travel — Architecture

## Overview

Atlora is structured as a **Turborepo monorepo** with three frontend applications, one core API server, one dedicated AI microservice, and a standalone design system package with its own Storybook environment. A reverse proxy unifies all services under a single host.

---

## Repository Structure

```
atlora/
├── apps/
│   ├── web/              # Next.js — public marketing site
│   ├── admin/            # Vite + React — agency admin portal
│   ├── portal/           # Vite + React — traveler portal
│   ├── api/              # Node.js + Hono — core tRPC API
│   └── ai-service/       # Python + FastAPI — AI microservice
│
├── packages/
│   ├── ui/               # Design system — components, tokens, Storybook
│   ├── db/               # Drizzle schema + client
│   ├── trpc/             # tRPC router definitions (shared)
│   └── types/            # Shared Zod schemas + TypeScript types
│
├── turbo.json
└── package.json
```

---

## Design System (`packages/ui`)

The design system is a **standalone package** that lives inside the monorepo but is developed and tested in complete isolation from the apps that consume it. It is not an app itself — it has no server, no routing, no data fetching. It is purely a library of components, design tokens, and visual primitives.

### What it contains

- **Design tokens** — colors, spacing, typography, shadows, border radii defined as CSS variables and Tailwind config extensions
- **Primitive components** — Button, Input, Badge, Card, Modal, Dropdown, etc.
- **Composite components** — TripCard, DestinationHero, BookingStatus, DataTable, etc.
- **Two token themes** — `brand` (public site: teal/pink/gold luxury palette) and `admin` (neutral, data-dense dashboard palette)
- **Storybook** — runs inside `packages/ui`, used to develop, document, and visually test components in isolation

### How apps consume it

Each app installs `packages/ui` as a local workspace dependency:

```json
// apps/web/package.json
{
  "dependencies": {
    "@atlora/ui": "workspace:*"
  }
}
```

Then imports components directly:

```tsx
import { Button, TripCard } from "@atlora/ui";
```

The app itself has no knowledge of how the component is built — it just uses the export. This means you can refactor, restyle, or swap the underlying implementation (e.g. change the headless primitive library) without touching any app code, as long as the component API stays the same.

### Why this separation matters

Keeping the design system as its own package with its own Storybook environment means:

- Components are built and tested against a blank canvas, not inside a real page where global styles, routing, and data can mask problems
- Any of the three apps can adopt a new component the moment it's published to the package — there's no duplication across apps
- Storybook serves as living documentation — designers, other developers, or future contributors can see every component and its variants without running the full app stack
- When multi-tenancy arrives in Phase 4, per-agency theming is a token-level change in `packages/ui`, not a surgery across three apps

### Storybook

Storybook runs as a dev tool inside `packages/ui`. It is never deployed as part of the production system — it is a development and documentation environment only.

```bash
# Run Storybook for component development
cd packages/ui
pnpm storybook
```

Stories cover:
- All component variants and states (default, hover, disabled, loading, error)
- Both `brand` and `admin` themes
- Responsive behavior

---

## Applications

### `apps/web` — Public Site
- **Framework:** Next.js 14 (App Router)
- **Rendering:** SSR + ISR for destination/trip/blog pages
- **Responsibilities:** Marketing pages, destination pages, trip discovery, blog, travel guides
- **Auth:** None (public) — inquiry form submits as guest
- **Design theme:** `brand` (luxury palette)
- **Communicates with:** `api` via tRPC HTTP client

### `apps/admin` — Agency Admin Portal
- **Framework:** Vite + React
- **Rendering:** SPA (no SSR needed)
- **Responsibilities:** CMS, CRM, trip/booking management, reporting
- **Who uses it:** Agency staff and agency admins (not platform owner)
- **Auth:** JWT via Clerk (`agency_admin`, `agency_staff` roles)
- **Design theme:** `admin` (neutral dashboard palette)
- **Communicates with:** `api` via tRPC

> Note: A future `platform_admin` role will grant access to a super-admin section within this app for platform-level management (billing, agency provisioning, impersonation). This is a Phase 4 concern.

### `apps/portal` — Traveler Portal
- **Framework:** Vite + React
- **Rendering:** SPA
- **Responsibilities:** Saved trips, bookings, documents, messages
- **Auth:** JWT via Clerk (`traveler` role)
- **Design theme:** `brand`
- **Communicates with:** `api` via tRPC

### `apps/api` — Core API Server
- **Runtime:** Node.js
- **Framework:** Hono
- **API Layer:** tRPC (type-safe RPC over HTTP)
- **Responsibilities:** All business logic, data access, auth validation, file uploads
- **Communicates with:** Postgres (via Drizzle), AI service (internal HTTP), S3-compatible storage

### `apps/ai-service` — AI Microservice
- **Runtime:** Python 3.12
- **Framework:** FastAPI
- **Responsibilities:** Semantic search, travel assistant chat, itinerary generation
- **Communicates with:** Postgres (read-only via asyncpg/SQLAlchemy), Anthropic API
- **Exposed endpoints:**
  - `POST /chat` — travel assistant
  - `POST /search/semantic` — vector search over content
  - `POST /itinerary/generate` — suggested itinerary

> The AI service is **read-only** against the database. All writes go through the core API.

---

## Routing (Single Host)

All services appear under one domain via a reverse proxy (Vercel rewrites in dev/staging, Nginx or Cloudflare in production).

```
https://atlora.com/              → apps/web        (Next.js)
https://atlora.com/portal/*      → apps/portal     (Vite SPA)
https://atlora.com/admin/*       → apps/admin      (Vite SPA)
https://atlora.com/api/*         → apps/api        (tRPC / Hono)
https://atlora.com/ai/*          → apps/ai-service (FastAPI)
```

Single domain = no cross-origin issues, auth cookies work across all apps.

---

## Data Layer

### Primary Database
- **Postgres** (hosted on Railway or Supabase)
- Single database, shared across all services
- Multi-tenancy via `agency_id` column + Postgres Row-Level Security (RLS)

### ORM
- **Drizzle** (TypeScript API)
- **asyncpg / SQLAlchemy** (AI service, Python)

### Vector Store
- **pgvector** extension on the same Postgres instance
- Stores embeddings for destinations, trips, blog posts
- Used by the AI service for semantic search

### File Storage
- **Cloudflare R2** or **AWS S3**
- Trip images, destination photos, traveler documents

### Search
- **Phase 1–3:** Postgres full-text search (`tsvector`)
- **Phase 4+:** Upgrade to Typesense if needed

---

## Authentication & Authorization

- **Provider:** Clerk
- Supports multi-tenant organizations (maps to agencies)
- Roles: `agency_admin`, `agency_staff`, `traveler`, `platform_admin` (Phase 4)
- JWT validated in the `api` server on every request
- `agency_id` extracted from JWT and applied to all DB queries

---

## Multi-Tenancy Strategy

- All tenant data lives in the **same Postgres database**
- Every tenant-scoped table has an `agency_id` foreign key
- Postgres RLS policies enforce data isolation at the DB level
- Agency branding/config stored in an `agencies` table
- Per-agency theming handled via design tokens in `packages/ui`
- Public site resolves agency by subdomain or custom domain (Phase 4)

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Public site | Next.js 14 (App Router) |
| Admin portal | Vite + React |
| Traveler portal | Vite + React |
| Core API | Hono + tRPC + Node.js |
| AI service | FastAPI + Python |
| Database | PostgreSQL |
| ORM (TS) | Drizzle |
| ORM (Python) | SQLAlchemy + asyncpg |
| Vector search | pgvector |
| Auth | Clerk |
| File storage | Cloudflare R2 |
| Monorepo | Turborepo |
| Design system | Custom (`packages/ui`) |
| Component dev/testing | Storybook |
| Styling | Tailwind CSS |
| Shared types/validation | Zod |
| AI provider | Anthropic Claude API |

---

## Phase Alignment

### Phase 1 — Foundation
- `apps/web`, `apps/api`, `packages/db`, `packages/ui` (core primitives)
- Auth, Countries, Regions, Destinations, Trips

### Phase 2 — Content Management
- `apps/admin` (CMS portion)
- Hotels, Attractions, Blog, Travel Guides
- Expand `packages/ui` with admin-themed components

### Phase 3 — CRM & Traveler Features
- `apps/portal`, full `apps/admin` CRM
- Traveler accounts, bookings, inquiries

### Phase 4 — Advanced
- `apps/ai-service`
- Payments (Stripe), multi-tenancy (RLS + Clerk orgs), reporting
- Platform super-admin layer

---

## Key Design Decisions

**Why a standalone design system package?**
The design system lives in `packages/ui` and is consumed by apps as a dependency, not copy-pasted between them. This means components are built once, tested in Storybook in isolation, and adopted by any app without duplication. It also cleanly separates visual concerns from application logic — an app should never need to know how a Button is built, only how to use it.

**Why two design themes?**
The public site and traveler portal use the Atlora brand palette (teal, pink, gold) — luxury and emotive. The admin portal needs a neutral, functional aesthetic suited to data-dense CRM work. Both themes live as token sets in `packages/ui`, so the same `Button` component renders correctly in either context without any conditional logic in the component itself.

**Why tRPC over REST or GraphQL?**
All frontends are TypeScript. tRPC gives end-to-end type safety without a codegen step — changing a server function signature immediately surfaces type errors in every client that calls it. For a solo/small team, this eliminates an entire class of API contract bugs.

**Why a separate AI service?**
Python's AI ecosystem (LangChain, sentence-transformers, pgvector clients) is meaningfully better than Node's. The AI service also has a different scaling profile — LLM calls are slow and expensive and benefit from independent queuing/caching. Keeping it separate means AI changes never touch the core API.

**Why a single database?**
Simpler operations, simpler multi-tenancy (RLS rather than per-tenant schemas), and pgvector lives alongside relational data with no sync needed. Splitting databases is an optimization for a much later stage.

**Why not a Next.js monolith?**
The three surfaces (public site, admin CRM, traveler portal) have different rendering needs, auth models, and dependency profiles. Next.js is the right tool for the SEO-heavy public site but fights against you when building a complex SPA-style admin dashboard.
