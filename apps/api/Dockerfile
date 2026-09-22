# Build context is the repo root (see docker/compose.yaml) — turbo prune
# needs the full monorepo to compute @atlora/api's dependency graph.
#
# Apple Silicon dev machines build this as linux/arm64 by default (Docker
# Desktop matches the host architecture unless told otherwise). No
# multi-arch tooling here on purpose — there's no deployment target to
# match (see the Docker handoff, Milestone 3 "Architecture").

# ---- pruner -----------------------------------------------------------
# Full repo; extracts just what @atlora/api needs so later layers don't
# reinstall/rebuild the whole monorepo on every source edit.
FROM node:22-bookworm-slim AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune @atlora/api --docker

# ---- installer ----------------------------------------------------------
FROM node:22-bookworm-slim AS installer
WORKDIR /app
RUN corepack enable

# Lockfile + every package.json in the dependency graph, nothing else.
# This layer only invalidates on a dependency change, not a source edit.
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# turbo prune doesn't copy arbitrary root files, only what the
# package/lockfile graph references — tsconfig.base.json is extended by
# every package's tsconfig.json but isn't part of that graph.
COPY tsconfig.base.json ./tsconfig.base.json

# Now the actual source for the pruned workspaces.
COPY --from=pruner /app/out/full/ .

RUN npx turbo build --filter=@atlora/api...

# packages/db and packages/types are consumed as raw TypeScript in dev
# (package.json main/exports point at src/index.ts, so tsx/Vite can import
# them directly with no build step of their own). Plain `node` can't
# execute .ts at all, so this repoints THIS COPY's package.json files at
# the dist/ the build above just produced. The real repo, and every dev
# workflow using it, is untouched — see the script for why.
COPY docker/scripts/patch-workspace-exports.js ./patch-workspace-exports.js
RUN node ./patch-workspace-exports.js

# Deliberately still has full (dev+prod) node_modules at this point —
# docker/compose.yaml's `migrate` service targets this stage directly,
# since drizzle-kit (needed to run migrations) is a devDependency of
# packages/db. Production-only pruning happens in the runner stage below,
# which `api` builds instead.

# ---- runner ---------------------------------------------------------
FROM node:22-bookworm-slim AS runner
WORKDIR /app
RUN corepack enable \
  && groupadd --system --gid 1001 atlora \
  && useradd --system --uid 1001 --gid atlora atlora

COPY --from=installer /app .

# `pnpm prune --prod` here would be the obvious line, but pnpm 9 prompts
# interactively ("The modules directories will be removed and reinstalled
# from scratch. Proceed?") even under `docker build`'s non-TTY stdin — and
# rather than failing loudly, it silently no-ops, leaving node_modules
# partially intact (devDependencies like `typescript` stayed, while at
# least one real dependency's optional native binary — @node-rs/argon2's —
# ended up missing when this was tested). A clean reinstall from the
# frozen lockfile, scoped to production deps from the start, sidesteps the
# prompt entirely.
RUN rm -rf node_modules && pnpm install --prod --frozen-lockfile \
  && chown -R atlora:atlora /app

USER atlora
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "apps/api/dist/server.js"]
