# Atlora — Claude Context

This is the root context file for the Atlora Travel monorepo. Read this before making any changes to the repository.

---

## What This Project Is

Atlora is a multi-tenant travel platform built as a portfolio-quality demonstration of full-stack engineering, SaaS architecture, and AI integration. It is not a simple travel website — it is a platform that travel agencies use to manage destinations, trips, travelers, and content.

Full spec: `atlora_spec.md`
Full architecture: `ARCHITECTURE.md`

---

## Monorepo Structure

```
atlora/
├── apps/
│   ├── web/              # Next.js 14 — public marketing site (SSR/ISR)
│   ├── admin/            # Vite + React — agency admin portal (SPA)
│   ├── portal/           # Vite + React — traveler portal (SPA)
│   ├── api/              # Hono + tRPC — core API server
│   └── ai-service/       # FastAPI (Python) — AI microservice
│
├── packages/
│   ├── ui/               # Design system — components, tokens, Storybook
│   ├── db/               # Drizzle schema, migrations, exported client
│   ├── trpc/             # Shared tRPC router type definitions
│   └── types/            # Shared Zod schemas and TypeScript types
│
├── CLAUDE.md             # This file
├── ARCHITECTURE.md       # Full architecture reference
├── turbo.json            # Turborepo pipeline config
└── package.json          # Root workspace config
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Public site | Next.js 14 (App Router) |
| Admin + Traveler portals | Vite + React |
| Core API | Hono + tRPC + Node.js |
| AI service | FastAPI + Python 3.12 |
| Database | PostgreSQL (Railway or Supabase) |
| ORM | Drizzle (TS), SQLAlchemy + asyncpg (Python) |
| Vector search | pgvector |
| Auth | Clerk |
| File storage | Cloudflare R2 |
| Monorepo tooling | Turborepo + pnpm workspaces |
| Design system | Custom (`packages/ui`) + Storybook |
| Styling | Tailwind CSS |
| Validation | Zod |
| AI provider | Anthropic Claude API |

---

## Package Conventions

### Naming
All internal packages use the `@atlora/` scope:
- `@atlora/ui`
- `@atlora/db`
- `@atlora/trpc`
- `@atlora/types`

### Adding a dependency to a workspace package
```bash
# Add to a specific app
pnpm add <package> --filter @atlora/web

# Add to a specific internal package
pnpm add <package> --filter @atlora/ui

# Add to root (tooling only — eslint, turbo, etc.)
pnpm add -D <package> -w
```

### Referencing internal packages
```json
{
  "dependencies": {
    "@atlora/ui": "workspace:*",
    "@atlora/db": "workspace:*"
  }
}
```

---

## Key Packages

### `packages/ui` — Design System
- The component library. Built and tested in Storybook in complete isolation.
- Apps never define their own base components — they import from here.
- Contains two token themes: `brand` (luxury palette) and `admin` (neutral dashboard).
- Storybook runs inside this package only, never inside an app.
- Do not add routing, data fetching, or app-level logic here.

### `packages/db` — Database
- Single source of truth for the Drizzle schema.
- Exports a singleton `db` client and all Drizzle-inferred types.
- Migrations always run from here, never from an app.
- The Python AI service connects directly via SQLAlchemy — it does not use this package.

### `packages/trpc` — API Types
- Exports the tRPC router type (`AppRouter`) so frontends get type safety.
- The actual router implementation lives in `apps/api`.
- Frontends import the type from here, not from `apps/api` directly.

### `packages/types` — Shared Types
- Zod schemas for shared domain models (Trip, Destination, Traveler, etc.)
- These are used for validation on both the API and frontend sides.
- No runtime dependencies — pure types and Zod schemas only.

---

## Running the Project

```bash
# Install all dependencies
pnpm install

# Run all apps in dev mode
pnpm dev

# Run a specific app
pnpm dev --filter @atlora/web
pnpm dev --filter @atlora/admin

# Build everything
pnpm build

# Run Storybook (design system only)
cd packages/ui && pnpm storybook

# Database
pnpm db:migrate       # run migrations
pnpm db:generate      # generate a new migration from the Drizzle schema
pnpm db:studio        # open Drizzle Studio
```

---

## Current Session Goal

Scaffold the base monorepo structure:

- [ ] Root `package.json` (pnpm workspaces)
- [ ] `turbo.json` (pipeline config)
- [ ] `apps/web/` — Next.js 14 skeleton
- [ ] `apps/admin/` — Vite + React skeleton
- [ ] `apps/api/` — Hono + tRPC server skeleton
- [ ] `packages/ui/` — design system skeleton + Storybook config
- [ ] `packages/db/` — Drizzle schema skeleton + client export
- [ ] `packages/trpc/` — tRPC router type skeleton
- [ ] `packages/types/` — shared Zod schemas skeleton

Apps not scaffolded tonight: `apps/portal`, `apps/ai-service`

---

## Rules

- **Never install dependencies directly into the root** unless they are monorepo-level tooling (Turbo, ESLint, TypeScript configs).
- **Never duplicate types** across packages — if a type is shared, it belongs in `packages/types`.
- **Never write data fetching logic in `packages/ui`** — it is a pure component library.
- **All database writes go through `apps/api`** — the AI service is read-only.
- **Keep `packages/trpc` as types only** — no business logic lives there.
- **Use `pnpm`** — not npm or yarn.
