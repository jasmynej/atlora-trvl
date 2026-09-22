# Build context is the repo root (see docker/compose.yaml) — turbo prune
# needs the full monorepo to compute @atlora/web's dependency graph.
#
# @atlora/web depends on @atlora/trpc, which depends on @atlora/api for one
# type-only re-export (packages/trpc/src/index.ts) — turbo prune and pnpm
# install don't distinguish type-only from runtime dependencies, so this
# build installs all of apps/api's runtime deps too even though none of
# that code is ever imported at the JS level. Wasteful but not broken; see
# apps/admin/Dockerfile, which has the identical situation.
#
# @atlora/ui and @atlora/types are consumed as raw TypeScript (their
# package.json main/exports point at src/index.ts), same pattern as
# apps/admin's dependencies — but next.config.ts's `transpilePackages`
# tells Next to transpile and inline them directly into its own build
# output, so (unlike apps/api's Dockerfile) there's no equivalent of
# patch-workspace-exports.js needed: nothing needs to `require()` them as
# a real package at runtime. Verified during development by temporarily
# importing a real @atlora/ui component into a page, confirming its code
# (and CSS classes) actually appear in the compiled output.

# ---- pruner -----------------------------------------------------------
FROM node:22-bookworm-slim AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune @atlora/web --docker

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

RUN npx turbo build --filter=@atlora/web...

# ---- runner ---------------------------------------------------------
# Next's `output: 'standalone'` (next.config.ts) traces only the
# node_modules apps/web's server actually needs — that trace is rooted at
# outputFileTracingRoot (the monorepo root, also set in next.config.ts),
# without which the copied bundle would be missing workspace dependencies
# and fail at runtime with a module-not-found instead of at build time.
#
# Standalone output does NOT include .next/static or public/ on its own
# (a well-known Next gotcha) — both are copied in explicitly below.
# apps/web has no public/ directory today; add a COPY for it here if one
# is ever added, or static assets under it will 404 in this image while
# working fine in dev.
FROM node:22-bookworm-slim AS runner
WORKDIR /app
RUN groupadd --system --gid 1001 atlora \
  && useradd --system --uid 1001 --gid atlora atlora

COPY --from=builder --chown=atlora:atlora /app/apps/web/.next/standalone ./
COPY --from=builder --chown=atlora:atlora /app/apps/web/.next/static ./apps/web/.next/static

USER atlora
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
