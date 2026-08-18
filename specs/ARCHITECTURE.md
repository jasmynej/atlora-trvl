# Atlora — Architecture

> **Status:** Revised for the two-sided marketplace model. Supersedes the previous single-sided white-label CMS/CRM framing. Read alongside `FEATURES.md` and `BRAND.md`.

## Overview

Atlora is a **Turborepo monorepo** containing three web applications, one mobile application, one core API server, one AI microservice, and a standalone design system package with its own Storybook environment. A reverse proxy unifies the web services under a single host.

The architecture is shaped by one constraint above all others: **data lives at three different ownership levels — platform, agency, and traveler — and the boundaries between them are security boundaries, not conveniences.** The shared destination catalog is platform-owned. CRM and trip data are agency-owned. Identity, documents, and self-planned itineraries are traveler-owned. Every routing, auth, and data-access decision below follows from that split.

---

## Repository Structure

```
atlora/
├── apps/
│   ├── web/              # Next.js — public site, discovery, catalog
│   ├── admin/            # Vite + React — agency admin portal
│   ├── portal/           # Vite + React — traveler portal
│   ├── mobile/           # Expo — traveler mobile app
│   ├── api/              # Node.js + Hono — core tRPC API
│   └── ai-service/       # Python + FastAPI — AI microservice
│
├── packages/
│   ├── ui/               # Design system — components, tokens, Storybook
│   ├── db/               # Prisma schema + client
│   ├── trpc/             # tRPC router definitions + procedure guards
│   └── types/            # Shared Zod schemas + TypeScript types
│
├── turbo.json
└── package.json
```

---

## Data Ownership Model

This is the core architectural constraint. Three ownership levels, three enforcement keys.

| Level | Key | Examples | Guard |
|---|---|---|---|
| **Platform** | none | `Destination`, `Region`, `DestinationType`, platform config | `platformProcedure` |
| **Agency** | `agency_id` | `Trip`, `Client`, `Booking`, `Communication`, `AgencyProfile`, `AdvisorProfile` | `agencyProcedure` |
| **Traveler** | `traveler_id` | `TravelerProfile`, `TravelerDocument`, `PartyMember`, traveler-owned `Itinerary`, saved trips | `travelerProcedure` |

**Cross-boundary reads never happen by direct FK access.** An agency reading traveler-granted profile fields resolves through the `Engagement` record and its consent tier. There is no query path from `Client` to `TravelerProfile` sensitive fields that bypasses consent resolution.

### Notable model splits

- **`TravelerProfile` / `Client` / `Engagement`** — identity is platform-level and traveler-owned; relationship data is agency-owned; the join carries consent tier and status. A `TravelerProfile` can exist with zero agency relationships, which is what makes discovery and self-planning possible at all.
- **`Trip` vs. `Itinerary`** — `Trip` is an agency's packaged sellable offering and stays agency-scoped. `Itinerary` is a day-by-day plan with a polymorphic owner (traveler or agency) and supports **fork with ownership change**, which makes traveler→agency handoff, agency→traveler personalization, and agency→agency templating the same operation.

---

## Procedure Scoping (`packages/trpc`)

Three-way scoping is a security boundary and must exist before any traveler surface is built.

```ts
platformProcedure  // platform admin role — destination catalog, platform config
agencyProcedure    // agency_id from JWT — trips, clients, CRM, agency profile
travelerProcedure  // traveler_id from JWT — profile vault, saved trips, self-planned itineraries, trip hub
```

Entitlement checks resolve through a single function called from procedures rather than scattered per-route:

```ts
hasEntitlement(subject, feature)  // subject: Agency | TravelerProfile
```

---

## Applications

### `apps/web` — Public Site & Discovery
- **Framework:** Next.js (App Router)
- **Rendering:** SSR + ISR for destination, advisor profile, and trip pages
- **Responsibilities:** Destination catalog browse, advisor discovery and directory, agency/advisor profile pages, trip discovery, guided match intake, inquiry submission, advisor-authored content surfaced contextually
- **Auth:** Public; optional traveler session for saved state
- **Design theme:** `brand`
- **Communicates with:** `api` via tRPC HTTP client

> SEO matters here more than anywhere else in the system. Destination and advisor profile pages are the top of the traveler funnel, which is why this app is the one that needs server rendering.

### `apps/admin` — Agency Admin Portal
- **Framework:** Vite + React (SPA)
- **Responsibilities:** CRM, trip and itinerary management, agency and advisor profile editing, inbound lead handling, consent-scoped traveler profile reads, Workbench tools, reporting
- **Who uses it:** Agency staff and agency admins
- **Auth:** Clerk (`agency_admin`, `agency_staff`)
- **Design theme:** `admin`

> A future `platform_admin` role grants access to a super-admin section for catalog management, billing, agency provisioning, and impersonation. Deferred.

### `apps/portal` — Traveler Portal
- **Framework:** Vite + React (SPA)
- **Responsibilities:** Unified trip hub across all agencies, profile vault and consent controls, self-planning tools, Workbench tools, inquiries and engagement tracking, saved trips
- **Auth:** Clerk (`traveler`)
- **Design theme:** `brand`, with **per-trip agency branding scoped inside the Atlora shell** rather than replacing it

### `apps/mobile` — Traveler Mobile App
- **Framework:** Expo (React Native), NativeWind for styling
- **Responsibilities:** Trip hub, offline itinerary access, documents, messaging, flight alerts, maps. Workbench is review-only in v1.
- **Auth:** Clerk (`traveler`)
- **Deferred** in build order, but the traveler-facing experience is the target use case and the architecture is established now to avoid retrofitting.

### `apps/api` — Core API Server
- **Runtime:** Node.js · **Framework:** Hono · **API layer:** tRPC
- **Responsibilities:** All business logic, data access, auth validation, consent resolution, entitlement resolution, file uploads, supplier query orchestration and caching
- **Communicates with:** Postgres (Prisma), AI service (internal HTTP), Cloudflare R2, external supplier APIs

### `apps/ai-service` — AI Microservice
- **Runtime:** Python 3.12 · **Framework:** FastAPI
- **Responsibilities:** Semantic search over the shared catalog, advisor matching reasoning, itinerary generation and refinement, AI-assisted Workbench tools
- **Communicates with:** Postgres (read-only), Anthropic API
- **Endpoints:** `POST /chat`, `POST /search/semantic`, `POST /itinerary/generate`, `POST /match/advisors`

> The AI service is **read-only** against the database. All writes go through the core API.

---

## External Supplier Integrations

Introduced by **Epic J (Workbench)**. This is a dependency class the platform did not previously have, and it behaves differently from every other integration in the system.

| Concern | Implication |
|---|---|
| Per-call cost | Results must be cached; naive pass-through is financially unbounded |
| Rate limits | Requires request coalescing and backoff at the API layer |
| Latency | Supplier calls are slow; tool UIs must stream or poll, never block |
| Volatility | Fares and rates expire; cache TTL is short and per-supplier |
| Contract risk | Terms can change or terminate; no supplier may be load-bearing for a core flow |

**`SupplierQuery`** is the caching and normalization layer. Every external call goes through it: normalized request hash → cached response with per-supplier TTL → normalized result shape. Tools never call suppliers directly.

**Candidate suppliers (undecided):** air — Duffel, Amadeus Self-Service, Kiwi. Activities — Viator, GetYourGuide. Hotel content — undetermined.

**Tool output contract.** Every Workbench tool emits a candidate `ItineraryItem`, pinnable to an `Itinerary`. Tools are not search pages; they are itinerary input devices.

---

## Booking Boundary

Atlora does **not** take payment for flights, rooms, or activities and does **not** hold inventory. This is an architectural decision with real consequences: the system carries no reservation state machine, no cancellation or refund workflow, no inventory reconciliation, and no fulfillment liability.

Rationale is in `BRAND.md` — Atlora is positioned against OTAs, and a platform that takes booking payment is an OTA with a CRM attached. Payments infrastructure exists for **agency↔traveler** transactions (trip deposits, installments, advisor fees), not for supplier bookings.

**Affiliate revenue is permitted; commission-influenced ordering is not.** No payout, commission-rate, or partner-priority field may exist in any ranking or default-selection code path — in Workbench or in discovery. Enforced structurally at the schema level, the same way discovery placement is.

---

## Data Layer

### Primary Database
- **Postgres** (Railway or Supabase)
- Single database shared across all services
- Agency isolation via `agency_id` + Postgres Row-Level Security
- Traveler-owned tables carry `traveler_id` and are RLS-scoped independently of agency policies
- Platform-owned catalog tables carry no tenancy column and are write-guarded at the procedure layer

### ORM
- **Prisma** (TypeScript) · **asyncpg / SQLAlchemy** (AI service)

### Vector Store
- **pgvector** on the same Postgres instance, HNSW indexes
- Embeddings over destinations, trips, advisor profiles and advisor-authored content
- Powers semantic search and advisor matching

> Advisor-authored content functions as a demonstrated-expertise signal feeding the vector index and is surfaced contextually alongside destination pages — not as a chronological blog feed.

### File Storage
- **Cloudflare R2** — trip and destination media, traveler documents
- Traveler documents are consent-gated at the API layer; signed URLs are issued only after consent resolution

### Search
- Postgres full-text (`tsvector`) for lexical search; pgvector for semantic. Typesense only if lexical search becomes a bottleneck.

---

## Authentication & Authorization

- **Provider:** Clerk, organization-per-agency
- **Roles:** `agency_admin`, `agency_staff`, `traveler`, `platform_admin` (deferred)
- JWT validated in `api` on every request; `agency_id` or `traveler_id` extracted and applied to all queries
- A single human may hold both a traveler identity and an agency staff identity; these are distinct subjects and must not be merged

---

## Routing

Primary domain: `atloratravel.com` (`atlora.com` parked / potentially acquirable).

```
https://atloratravel.com/           → apps/web        (Next.js)
https://atloratravel.com/portal/*   → apps/portal     (Vite SPA)
https://atloratravel.com/admin/*    → apps/admin      (Vite SPA)
https://atloratravel.com/workbench/*→ portal or admin (context-dependent)
https://atloratravel.com/api/*      → apps/api        (tRPC / Hono)
https://atloratravel.com/ai/*       → apps/ai-service (FastAPI)
```

Single domain means no cross-origin issues and auth cookies work across all surfaces.

**Agency custom domains** are handled via **Cloudflare for SaaS** for automated SSL issuance. Cloudflare manages nameservers regardless of registrar. Per-agency public microsites are deprioritized — platform discovery is where travelers are intended to land — but the domain architecture supports them.

---

## Design System (`packages/ui`)

A standalone package developed and tested in isolation from consuming apps. No server, no routing, no data fetching.

**Contains:** design tokens (colors, spacing, typography, shadows, radii as CSS variables + Tailwind config), primitive components, composite components, two token themes, Storybook.

**Two themes:**
- `brand` — traveler-facing surfaces (public site, portal, mobile). Warm and approachable; per `BRAND.md`, the palette signals neither premium nor economy.
- `admin` — agency dashboard. Neutral and data-dense.

Per-trip agency branding scopes *inside* the Atlora shell rather than replacing it — this is a theming architecture concern, not a component.

**The largest net-new component work** for the marketplace model: advisor profile surfaces, profile vault and consent controls, and the itinerary builder canvas (the single biggest component in the system).

Storybook runs inside `packages/ui` as a dev/documentation tool and is never deployed to production.

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Public site | Next.js (App Router) |
| Admin portal | Vite + React |
| Traveler portal | Vite + React |
| Mobile | Expo + React Native + NativeWind |
| Core API | Hono + tRPC + Node.js |
| AI service | FastAPI + Python |
| Database | PostgreSQL |
| ORM (TS) | Prisma |
| ORM (Python) | SQLAlchemy + asyncpg |
| Vector search | pgvector (HNSW) |
| Auth | Clerk (org-per-agency) |
| File storage | Cloudflare R2 |
| DNS / custom domains | Cloudflare, Cloudflare for SaaS |
| Monorepo | Turborepo |
| Design system | Custom (`packages/ui`) |
| Component dev | Storybook |
| Styling | Tailwind CSS / NativeWind |
| Shared types | Zod |
| AI provider | Anthropic Claude API |
| Deployment | Vercel, Railway |

---

## Phase Alignment

Mirrors `FEATURES.md`. Traveler identity is pulled forward because the model is incoherent without it.

### Phase 1 — Foundation + Identity
`packages/db` (`TravelerProfile`/`Client`/`Engagement` split, polymorphic `Itinerary`), `packages/trpc` (three-way procedure scoping), `apps/web`, `apps/api`, `packages/ui` core primitives. Catalog, trips, agency onboarding, traveler auth.

### Phase 2 — Discovery
Agency and advisor profiles, advisor directory, inquiry and engagement routing, agency CRM lead handling, profile vault with consent tiers. Expands `apps/admin`.

### Phase 3 — Traveler Experience
`apps/portal`, `apps/mobile`, unified trip hub, document delivery, messaging, offline itineraries, free-tier self-planning. **Workbench shell + tool registry + `ItineraryItem` pinning; Layover Planner and Activity Finder** (no supplier dependency).

### Phase 4 — Monetization & Intelligence
`apps/ai-service`, entitlements and billing across both subject types, traveler paid tier, guided match, semantic search. **`SupplierQuery` caching layer; Flight Search and Stay Finder; affiliate handling.** Agency↔traveler payments processing. Platform super-admin.

---

## Key Design Decisions

**Why three ownership levels instead of one tenancy column?**
A traveler working with three agencies cannot be three disconnected records holding three copies of their passport. Making traveler data agency-scoped is the one modeling error that cannot be corrected later without migrating every traveler record in the system. The three-way split is the architecture; everything else is downstream of it.

**Why consent tiers rather than all-or-nothing sharing?**
Travelers will not hand passport data to an agency they have only inquired with, and field-level grants are unusable as UX. Tiers keyed to `Engagement.status` give meaningful control at a granularity people can actually reason about. This is the most novel component of the system and has no competitor equivalent.

**Why no in-platform booking?**
See Booking Boundary. It keeps Atlora structurally distinct from OTAs and keeps an entire category of infrastructure — reservation state, cancellations, refunds, fulfillment liability — out of the system.

**Why cache all supplier queries?**
Per-call cost and rate limits make naive pass-through financially unbounded. `SupplierQuery` also normalizes result shapes, so swapping an air supplier is a driver change rather than a rewrite of every tool that touches flights.

**Why a separate AI service?**
Python's AI ecosystem is meaningfully better than Node's, and LLM calls have a different scaling profile — slow, expensive, benefiting from independent queueing and caching. Keeping it separate means AI changes never touch the core API.

**Why a single database?**
Simpler operations, simpler tenancy via RLS rather than per-tenant schemas, and pgvector lives alongside relational data with no sync layer. Splitting is a much later optimization.

**Why tRPC?**
All frontends are TypeScript. End-to-end type safety without codegen; changing a server signature immediately surfaces errors in every client. For a small team this eliminates an entire class of contract bugs.

**Why not a Next.js monolith?**
The surfaces have different rendering needs, auth models, and dependency profiles. Next.js is right for the SEO-heavy public discovery site and fights back when building a data-dense SPA dashboard.

**Why a standalone design system package?**
Components are built once, tested in isolation, and adopted by any surface without duplication. It also makes per-trip agency theming a token-level change rather than surgery across four apps.
