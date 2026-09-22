# Build context is the repo root (see docker/compose.yaml) — turbo prune
# needs the full monorepo to compute @atlora/admin's dependency graph.
#
# Simpler than apps/api's Dockerfile: Vite bundles workspace packages'
# TypeScript source directly (esbuild), so there's no analogue of
# apps/api's raw-TS-can't-run-under-plain-node problem here, and no
# equivalent of docker/scripts/patch-workspace-exports.js is needed.
#
# @atlora/admin depends on @atlora/trpc, which depends on @atlora/api —
# for one type-only re-export (`export type { AppRouter }`,
# packages/trpc/src/index.ts). turbo prune and pnpm install don't
# distinguish type-only from runtime dependencies, so this build installs
# all of apps/api's runtime deps too (drizzle-orm, hono, @node-rs/argon2,
# ...) even though none of that code is ever imported at the JS level —
# wasteful but not broken; Vite tree-shakes the type-only import away
# entirely. Fixing that properly means changing how packages/trpc declares
# the dependency, which is out of scope here.

# ---- pruner -------------------------------------------------------------
FROM node:22-bookworm-slim AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune @atlora/admin --docker

# ---- builder --------------------------------------------------------
FROM node:22-bookworm-slim AS builder
WORKDIR /app
RUN corepack enable

# Lockfile + every package.json in the dependency graph, nothing else —
# this layer only invalidates on a dependency change, not a source edit.
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# turbo prune doesn't copy arbitrary root files, only what the
# package/lockfile graph references — tsconfig.base.json is extended by
# every package's tsconfig.json but isn't part of that graph.
COPY tsconfig.base.json ./tsconfig.base.json

# Now the actual source for the pruned workspaces.
COPY --from=pruner /app/out/full/ .

RUN npx turbo build --filter=@atlora/admin...

# ---- runner ---------------------------------------------------------
# Static files only past this point — Caddy, not Node.
FROM caddy:2-alpine@sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648 AS runner
COPY apps/admin/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/apps/admin/dist /srv
EXPOSE 80
