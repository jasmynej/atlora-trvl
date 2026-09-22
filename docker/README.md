# Docker

Living runbook for the containerized infra — how to run it, and how to
manually verify it's actually working. Update this file whenever a milestone
changes what's running where; it should always reflect current reality, not
the plan.

## Status

| Milestone | State |
|---|---|
| 1 — Infra compose + reverse proxy | ✅ Done |
| — `apps/admin` working through the proxy (`base` + HMR config) | ✅ Pulled forward from Milestone 5, done |
| 2 — Postgres roles | ✅ Done — roles/grants only. RLS policies + cross-tenant proof deferred (see [Postgres roles](#postgres-roles-milestone-2)) |
| 3 — `apps/api` container | ✅ Done — see [apps/api container](#appsapi-container-milestone-3) |
| 4 — Storage module + MinIO wiring | ✅ Done — see [Storage module](#storage-module-milestone-4) |
| 5 — `apps/admin` container | ✅ Done — see [apps/admin container](#appsadmin-container-milestone-5). `apps/portal` half **not done** — doesn't exist on disk (Phase 0), nothing to containerize |
| 6 — `apps/web` container | ✅ Done — see [apps/web container](#appsweb-container-milestone-6) |
| 7 — AI service container | **Out of scope for this repo** — atlora-ai is a separate, portable suite (MCP server, chatbot, etc.), not an app that lives here. See the [AI suite](#ai-suite) note. |

**Currently containerized:** `db`, `storage` (MinIO), `proxy` (Caddy),
`api`, `admin`, `web`, and `migrate` (one-shot). **Nothing app-level still
needs the host** — `pnpm dev` is now purely optional, for iteration only.
Caddy proxies to all three apps by their compose service names, no host
ports published for any of them (see
[apps/api container](#appsapi-container-milestone-3),
[apps/admin container](#appsadmin-container-milestone-5), and
[apps/web container](#appsweb-container-milestone-6)).

Every app's own `pnpm dev` process still starts on the host as part of the
root `pnpm dev` and still works standalone, but nothing routes to any of
them anymore — the proxy always reaches the containers. Redundant, not
broken; useful for fast iteration (HMR). `admin`'s dev server
(`http://localhost:3002/admin/...`) additionally has a `server.proxy`
entry in `vite.config.ts` forwarding `/api/*` to the host's own `apps/api`
(port 3001) — since the admin app's tRPC clients use relative paths
(Milestone 5), hitting the dev server directly would otherwise 404 on
every API call, including login. That host `apps/api` process points at
the same Docker-hosted db/MinIO as everything else
(`apps/api/.env` → `localhost:5433` / `localhost:9000`, the *same*
database and bucket the containerized stack uses, just reached at the
host-published address instead of the internal one) — so direct
`localhost:3002` access and the proxied `https://atlora.localhost` path
end up exercising the same data either way. Still worth periodically
verifying against `https://atlora.localhost` too, since that's the only
path that exercises the actual container images and Caddy routing, not
just the app code.

---

## Prerequisites

- Docker Desktop installed and running (`docker compose version` should work)
- `pnpm install` already run at the repo root
- `packages/db/.env` and `apps/api/.env` exist (copy from the adjacent
  `.env.example` files) — as of Milestone 2 these must point at the
  `atlora_owner` / `atlora_app` roles respectively, not `postgres` or the
  host's own Postgres install. See [Postgres roles](#postgres-roles-milestone-2).

## Quick start

```bash
# 1. Build + bring up infra. Creates the atlora_owner/atlora_app/
#    atlora_ai_ro roles on first run against a fresh volume (docker/init/
#    01-roles.sql), builds the api image, and applies migrations via the
#    one-shot `migrate` service — safe to re-run, already-applied
#    migrations are skipped.
docker compose -f docker/compose.yaml up -d --build

# 2. Create a platform admin so there's something to log in with (first
#    time only, or after a volume reset)
pnpm --filter @atlora/api cli:platform-user create \
  --email you@example.com --password 'SomeTestPassword123!' \
  --name "Your Name" --role platform_admin

# 3. Start the remaining host-side apps
pnpm dev

# 4. Visit https://atlora.localhost/
```

First visit will show a certificate warning — see
[Browser certificate warning](#browser-certificate-warning) below. Click
through it, or trust the CA properly once and forget about it.

Step 2 is only needed the first time, or after a volume reset (see
[Resetting the database volume](#resetting-the-database-volume)) — the `db`
container's data persists across `docker compose up`/`down` otherwise.

Changed `apps/api` source and want the container to pick it up? Rebuild
just that service — the install layer stays cached (see
[apps/api container](#appsapi-container-milestone-3)):
```bash
docker compose -f docker/compose.yaml up -d --build api
```

---

## Manual verification checklist

Run through this after `docker compose up` + `pnpm dev`, or any time you want
to confirm the whole stack is actually healthy end to end (not just "the
containers are running").

### 1. Containers are healthy

```bash
docker compose -f docker/compose.yaml ps
```

Expect `atlora-db` and `atlora-storage` as `Up ... (healthy)`, `atlora-proxy`
as `Up`. Plain `ps` won't list `atlora-storage-init` at all — it's a one-shot
bucket-creation job, not a long-running service, and exited containers are
hidden by default. Add `-a` if you want to see it (`Exited (0)` is correct).

### 2. Public site (containerized)

```bash
curl -sk -o /dev/null -w "%{http_code}\n" https://atlora.localhost/
curl -sk https://atlora.localhost/ | grep -o "<h1>.*</h1>"
# → <h1>Atlora Travel</h1>

docker compose -f docker/compose.yaml exec web id
# → uid=1001(atlora) gid=1001(atlora) — non-root, and proves the container
#   is up and exec-able
```

Expect `200`. This is `apps/web` (Next.js standalone build) reached
through the proxy — see
[apps/web container](#appsweb-container-milestone-6).

### 3. Admin app (containerized, both entries)

```bash
# Bare path (no trailing slash) — a real browser navigation typed/pasted
# this way, unlike every other check here. Should 308 → 200, not 404.
curl -sk -o /dev/null -w "%{http_code}\n" -L https://atlora.localhost/admin

curl -sk -o /dev/null -w "%{http_code}\n" https://atlora.localhost/admin/
curl -sk -o /dev/null -w "%{http_code}\n" https://atlora.localhost/admin/platform

# The actual JS entry the page requests — grep the real hashed filename out
# of the served HTML rather than hardcoding it, since vite renames it
# every build.
ASSET=$(curl -sk https://atlora.localhost/admin/ | grep -oE '/admin/assets/main-[^"]+\.js')
curl -sk -o /dev/null -w "%{http_code}\n" "https://atlora.localhost$ASSET"

# Deep-link refresh (bug #1) — a path that isn't a real file should still
# serve the shell, not 404.
curl -sk https://atlora.localhost/admin/catalog/destinations | grep -o "<title>.*</title>"
# → <title>Atlora Admin</title>
```

Expect `200` on the first four, and the deep-link check to return the
shell's title, not a 404 page. See
[apps/admin container](#appsadmin-container-milestone-5) for what's
actually happening at each step.

For a real visual check, open `https://atlora.localhost/admin/` and
`https://atlora.localhost/admin/platform` in a browser you've trusted the CA
in — you should see the agency admin shell and the "Atlora Platform" login
form render, not a blank page.

### 4. API (containerized)

```bash
curl -sk https://atlora.localhost/api/
# → {"status":"ok"}

curl -sk -o /dev/null -w "%{http_code}\n" "https://atlora.localhost/api/trpc/countries.list"
# → 200

# Confirm it's actually the container answering, not a stray host process:
docker compose -f docker/compose.yaml exec api id
# → uid=1001(atlora) gid=1001(atlora) — non-root, and proves the container
#   is up and exec-able

docker compose -f docker/compose.yaml port api 3001
# → prints nothing / "invalid IP:0" — correct. No host port is published
#   for `api` on purpose; it's reachable only through the proxy. Don't
#   curl localhost:3001 directly to check this — if apps/api's own
#   `pnpm dev` happens to be running on the host too (see Status above),
#   it coincidentally answers on the same port number and gives a false
#   "it's published" result that has nothing to do with the container.
```

### 5. Login + session cookie (the auth acceptance test)

Requires a platform user to exist (see [Quick start](#quick-start) step 3 if
you haven't made one yet). To reset an existing one's password instead:

```bash
pnpm --filter @atlora/api cli:platform-user reset-password \
  --email you@example.com --password 'SomeTestPassword123!'
```

Then:

```bash
curl -sk -c /tmp/atlora-cookies.txt -X POST \
  "https://atlora.localhost/api/trpc/platform.auth.login" \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"SomeTestPassword123!"}' \
  -D - -o /tmp/login-body.json
```

Expect a `set-cookie: atlora_platform_session=...; HttpOnly; Secure;
SameSite=Lax` header and a `200` with the user's `id`/`email`/`role` in the
body. Then confirm the cookie is actually honored on a follow-up request:

```bash
curl -sk -b /tmp/atlora-cookies.txt "https://atlora.localhost/api/trpc/platform.auth.me"
```

Expect the same user back, `200`. If you'd rather do this by hand: open
`https://atlora.localhost/admin/platform`, sign in, and confirm you land on
the catalog dashboard (Countries/Regions/Destinations/POI tabs with real
data) instead of bouncing back to the login form.

### 6. Not-yet-scaffolded apps 502 correctly

```bash
curl -sk -o /dev/null -w "%{http_code}\n" https://atlora.localhost/portal/
```

Expect `502` — that's correct, not a bug. `apps/portal` doesn't exist on
disk yet (confirmed in the Phase 0 audit). This stops being the expected
result once it's scaffolded and wired into the Caddyfile. There's no
equivalent `/ai/*` check — that route doesn't exist at all (see the
[AI suite](#ai-suite) note), not just not-yet-wired.

### 7. MinIO

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9000/minio/health/live
curl -sk -o /dev/null -w "%{http_code}\n" http://localhost:9001/
```

Expect `200` on both. Then either:
- Console: open `http://localhost:9001`, log in `minioadmin` / `minioadmin`,
  confirm the `atlora-travel` bucket exists, or
- CLI: `docker compose -f docker/compose.yaml logs storage-init` should show
  `Bucket created successfully` and `Access permission ... set to download`.

### 8. Postgres roles have the right privileges

```bash
PSQL=psql # or the full Postgres.app path, see Troubleshooting

# atlora_app: SELECT works, DDL is refused
$PSQL "postgresql://atlora_app:atlora_app@localhost:5433/atlora" -c "SELECT count(*) FROM platform_users;"
$PSQL "postgresql://atlora_app:atlora_app@localhost:5433/atlora" -c "CREATE TABLE nope (id int);"

# atlora_ai_ro: SELECT works, INSERT is refused
$PSQL "postgresql://atlora_ai_ro:atlora_ai_ro@localhost:5433/atlora" -c "SELECT count(*) FROM platform_users;"
$PSQL "postgresql://atlora_ai_ro:atlora_ai_ro@localhost:5433/atlora" -c "INSERT INTO platform_users (id, email, password_hash, name, role) VALUES ('x','x@x.com','x','x','platform_admin');"

# atlora_owner owns every table (compare against tableowner column)
$PSQL "postgresql://postgres:postgres@localhost:5433/atlora" -c "SELECT tablename, tableowner FROM pg_tables WHERE schemaname='public';"
```

Expect the `SELECT`s to return a row count, both write attempts to fail with
`permission denied`, and every `tableowner` to read `atlora_owner`. See
[Postgres roles](#postgres-roles-milestone-2) for what this is proving (and
not yet proving — there's no RLS policy under test here, just role/grant
boundaries).

### 9. Migration service applied cleanly

```bash
docker compose -f docker/compose.yaml logs migrate
```

Expect `> drizzle-kit migrate` followed by no errors, and the container
exits `0`. To prove it actually works against a genuinely empty database
(not just "didn't error because everything already existed"), see
[Resetting the database volume](#resetting-the-database-volume) and check
`\dt` afterward — all 13 tables should exist, owned by `atlora_owner`.

### 10. Storage module round trip

```bash
RESP=$(curl -sk -X POST "https://atlora.localhost/api/trpc/storage.getUploadUrl" \
  -H "Content-Type: application/json" \
  -d '{"key":"test/check.txt","contentType":"text/plain"}')
echo "$RESP"
```

Expect `uploadUrl` and `publicUrl` both hosted at `localhost:9000` (not
`storage:9000`, even when `api` is the container answering — see
[Storage module](#storage-module-milestone-4) for why that split matters).
Extract `uploadUrl` from the response and actually use it:

```bash
curl -X PUT "<uploadUrl from above>" -H "Content-Type: text/plain" --data "hello" -w "\n%{http_code}\n"
curl http://localhost:9000/atlora-travel/test/check.txt
# → hello

curl -sk -X POST "https://atlora.localhost/api/trpc/storage.deleteObject" \
  -H "Content-Type: application/json" -d '{"key":"test/check.txt"}'
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9000/atlora-travel/test/check.txt
# → 404
```

`getSignedUrl` (private GET) and `deleteObjectsByPrefix` aren't wired to any
procedure yet (Epic D hasn't landed) — exercise them directly if needed:

```bash
docker compose -f docker/compose.yaml exec -w /app/apps/api api node -e "
const { storage } = require('./dist/lib/storage');
storage.getSignedUrl('some/key', 60).then(console.log);
"
```

---

## Reference

### Services

| Service | What it is | Host port(s) |
|---|---|---|
| `db` | `pgvector/pgvector:pg17` | `5433` → container `5432` |
| `storage` | MinIO (S3-compatible) | `9000` (API), `9001` (console) |
| `storage-init` | One-shot `mc` job, creates the `atlora-travel` bucket | n/a (exits after running) |
| `api` | `apps/api`, built from its `Dockerfile` | none — proxy-only, see [apps/api container](#appsapi-container-milestone-3) |
| `admin` | `apps/admin`, static build served by Caddy | none — proxy-only, see [apps/admin container](#appsadmin-container-milestone-5) |
| `web` | `apps/web`, Next.js standalone build | none — proxy-only, see [apps/web container](#appsweb-container-milestone-6) |
| `migrate` | One-shot, applies Drizzle migrations as `atlora_owner` | n/a (exits after running) |
| `proxy` | Caddy, `tls internal` | `80`, `443` |

### Browser certificate warning

Caddy issues its own local CA cert (`tls internal`) inside the container,
which is not automatically trusted by your host's browsers. You'll see a
"not secure" / self-signed warning on first visit. For local dev, either:

- **Click through it** (fine for this project's purposes), or
- **Trust the CA properly**:
  ```bash
  docker compose -f docker/compose.yaml exec proxy cat /data/caddy/pki/authorities/local/root.crt > /tmp/atlora-local-ca.crt
  ```
  then add `/tmp/atlora-local-ca.crt` to Keychain Access → System →
  Certificates, and set it to "Always Trust".

### Why port 5433, not 5432

The host already runs Postgres.app on `5432` (found during Phase 0). Rather
than asking you to stop it, the containerized `db` publishes on `5433`
instead. Postgres.app itself can keep running without conflict since it's a
different port — nothing in this repo uses it anymore.

Two different paths reach the same `db` container, depending on who's
asking: the host — `pnpm dev`'s `apps/api`, the platform-user CLI,
`pnpm db:migrate`, direct `psql` — goes through the published `5433`.
The containerized `api` and `migrate` (Milestone 3) are on the same
compose network as `db` and use its internal port directly:
`db:5432`, set via `environment:` in `docker/compose.yaml`, not read from
any `.env` file.

### Postgres roles (Milestone 2)

`docker/init/01-roles.sql` creates three roles the first time the `db`
container starts against an empty volume:

| Role | Password (local dev only) | Used by | Privileges |
|---|---|---|---|
| `atlora_owner` | `atlora_owner` | `packages/db/.env` — migrations only | Owns the schema/tables; the only role that can `CREATE`/`ALTER`/`DROP` |
| `atlora_app` | `atlora_app` | `apps/api/.env` — the running API | `SELECT`/`INSERT`/`UPDATE`/`DELETE` on tables, `USAGE` on sequences. No DDL, not a table owner. |
| `atlora_ai_ro` | `atlora_ai_ro` | the atlora-ai suite (separate repo, see [AI suite](#ai-suite)) | `SELECT` only |

`ALTER DEFAULT PRIVILEGES` means every table a *future* migration creates
(as `atlora_owner`) is automatically readable/writable by `atlora_app`
without a manual grant — verified in [checklist item 8](#8-postgres-roles-have-the-right-privileges).

**What this does and doesn't prove.** The role/privilege separation itself
is real and verified: `atlora_app` cannot run DDL, cannot own tables, and
has no more access than plain `SELECT`/`INSERT`/`UPDATE`/`DELETE`;
`atlora_ai_ro` cannot write at all. What's **not** done yet is the actual
point of doing this — RLS. There is no `ENABLE ROW LEVEL SECURITY`, no
`FORCE ROW LEVEL SECURITY`, and no cross-tenant isolation policy anywhere,
because the only table with a subject-scoped column today is
`platform_users` (platform-level, not multi-tenant) — there's no
agency-owned table yet to write a real policy against or prove isolation
on. When one lands: add `ENABLE`/`FORCE ROW LEVEL SECURITY` to it in the
same migration, write the policy, and write the proof described in the
Docker handoff's Milestone 2 ("The proof" — cross-tenant read denied, and
critically, access denied when the RLS context is unset, not silently
allowed).

If you need to reach the container as its bootstrapping superuser (e.g. to
inspect roles or grants), use `postgres` / `postgres` — that's the
`POSTGRES_USER`/`POSTGRES_PASSWORD` in `docker/compose.yaml`, distinct from
all three roles above and never used by any app.

### AI suite

There is no `apps/ai-service` in this repo, and there won't be — atlora-ai
(MCP server, chatbot, and whatever else comes up) is a separate, portable
codebase, not another app in this monorepo. Two things stayed anyway,
deliberately:

- **`atlora_ai_ro`** (see the roles table above) — a read-only Postgres
  role, kept because atlora-ai still needs read access to this same
  database; it's just provisioned as a plain set of credentials handed to
  an external service, the same way you'd hand out DB access to any other
  outside consumer, rather than as part of this repo's own app surface.
- **Nothing else.** There's no `/ai/*` Caddy route (removed — it was
  pointing at a `host.docker.internal:8000` that was never going to exist
  here) and no `ai-service` entry in `docker/compose.yaml`. If atlora-ai
  ever needs to sit behind this proxy or in this compose file, that's a
  real integration decision to make then, not a stub worth carrying now on
  the chance it's needed.

### apps/api container (Milestone 3)

`apps/api/Dockerfile` is a three-stage build, matching the Docker handoff's
layout: **pruner** (`turbo prune @atlora/api --docker` against the full
repo) → **installer** (installs from `out/json/`'s lockfile, copies
`out/full/`'s source, runs `turbo build`) → **runner** (slim, non-root,
production deps only). Build context is the repo root (`context: ..` in
`docker/compose.yaml`) — the pruner stage needs the whole monorepo.

**Two real bugs worth knowing about if this Dockerfile ever needs surgery:**

1. **`packages/db` and `packages/types` are consumed as raw TypeScript.**
   Their `package.json` `main`/`exports`/`types` point straight at
   `src/index.ts` so tsx and Vite can import them with zero build step —
   great for dev, but plain `node` cannot execute a `.ts` file at all.
   Running the compiled `apps/api` against them as-is fails immediately on
   `require('@atlora/db')`. The fix, entirely contained to the Docker
   build: both packages got a `tsconfig.build.json` (CommonJS output,
   `tsc -p tsconfig.build.json` as their new `build` script — the real
   `tsconfig.json` stays `noEmit: true` for dev/typecheck), and
   `docker/scripts/patch-workspace-exports.js` repoints the **image's copy**
   of their `package.json` at the resulting `dist/` after `turbo build`
   runs. The real repo's `package.json` files are untouched — `pnpm dev`
   doesn't know or care this exists.

   A related wrinkle: `@atlora/db`'s `package.json` declares
   `"type": "module"`, but its `dist/` output (compiled as CommonJS to
   match `apps/api`'s own build) needs Node to treat it as CommonJS
   regardless. The patch script also drops a nested
   `dist/package.json` with `{"type": "commonjs"}`, which Node respects for
   files under that directory over the parent's declared type.

   `apps/api/tsconfig.build.json` exists for the same underlying reason:
   its real `tsconfig.json` targets `module: ESNext` / `moduleResolution:
   bundler` for tsx's benefit, and compiling *that* with plain `tsc` emits
   extensionless relative imports (`from './index'`) that Node's own ESM
   resolver refuses to load (`ERR_MODULE_NOT_FOUND`) without either
   `"type": "module"` *and* explicit `.js` extensions on every relative
   import across the codebase, or targeting CommonJS instead. CommonJS was
   the smaller, zero-source-changes fix.

2. **`pnpm prune --prod` doesn't work under `docker build`.** It's the
   obvious way to strip devDependencies before the runner stage, but pnpm 9
   prompts interactively ("The modules directories will be removed and
   reinstalled from scratch. Proceed?") even with non-TTY stdin — and
   instead of failing loudly, it silently no-ops, leaving `node_modules`
   partially intact. When this was tested, that meant `typescript` was
   still present (devDeps not actually removed) while
   `@node-rs/argon2`'s native binary had gone missing (something had
   started tearing the directory down before quitting) — a container that
   looks like it built fine and then fails at runtime the first time
   something touches argon2. The fix: `rm -rf node_modules && pnpm install
   --prod --frozen-lockfile` instead — same end state, no prompt.

**Why `migrate` targets the `installer` stage, not `runner`.** `drizzle-kit`
is a devDependency of `packages/db` — the `runner` stage (which `api`
builds) deliberately strips it via the prod-only reinstall above.
`docker/compose.yaml`'s `migrate` service uses `target: installer` to reach
a stage that still has it, working directory `packages/db`, command
`pnpm run migrate`.

**No published host port for `api`, on purpose.** Every surface goes
through the proxy; publishing `3001` would let something bypass it, which
silently breaks the `Secure`/`SameSite=Lax` cookie flow the auth section of
the Docker handoff warns about. Verified in
[checklist item 4](#4-api-containerized) — direct connection should fail.

### Storage module (Milestone 4)

`apps/api/src/lib/storage/` is one S3-compatible driver
(`s3Driver.ts`) that serves both MinIO and R2 — they differ only in
endpoint and credentials, selected by `STORAGE_DRIVER` (`minio` | `r2`).
Every procedure depends on the narrow interface in `types.ts`
(`putObject`, `getSignedUrl`, `getSignedUploadUrl`, `getPublicUrl`,
`deleteObject`, `deleteObjectsByPrefix`) and never imports an S3 client
directly — `routers/storage.ts` and `routers/media.ts` were the only two
callers of the old `lib/r2.ts` (now deleted) and both go through `storage`
now. Local dev defaults to `minio` (both `apps/api/.env` for the host and
`docker/compose.yaml`'s `api` service force it).

**The one non-obvious piece: two different endpoints for MinIO, one for
R2.** A presigned URL's host is part of what gets cryptographically signed
— whoever holds the URL must hit that exact host or the signature is
rejected. When `api` runs in the container, the S3 client needs
`MINIO_ENDPOINT=http://storage:9000` (the compose service name) to make
*real* calls (`putObject`, `deleteObject`, `deleteObjectsByPrefix`,
`ListObjectsV2` inside the prefix-delete loop) — but a browser can never
resolve `storage`, only `localhost`. Signing itself is a local, offline
computation with no network call, so `s3Driver.ts` uses a *second* S3
client, configured with `MINIO_PUBLIC_ENDPOINT=http://localhost:9000`,
purely for `getSignedUrl`/`getSignedUploadUrl` — it never needs to actually
connect to that address, only to sign as if it will. Verified in
[checklist item 10](#10-storage-module-round-trip): the returned URLs
always say `localhost:9000`, even when the container answered the request.
On the host, `MINIO_ENDPOINT` and `MINIO_PUBLIC_ENDPOINT` are the same
value (`localhost` means the same thing to the process and the browser
there), so `apps/api/.env` only sets one. R2 doesn't have this problem at
all — one real, universally-resolvable endpoint for everything — so
`publicEndpoint` is left unset in that branch of `lib/storage/index.ts`.

**R2 divergences, commented at the point they'd bite** (not exercised by
MinIO, so easy to forget): object ACLs are a silent no-op on R2 — bucket
policy handles public access instead, so `putObject` never sets one.
Presigned URLs cap at 7 days on R2 (not MinIO) — `getSignedUrl`/
`getSignedUploadUrl` don't enforce this, so a long-lived request against
R2 silently comes back shorter than asked. Lifecycle rules and storage
classes differ too, relevant whenever the `archived` engagement retention
tier gets built.

**Only seed/synthetic data, still.** No real passport scans, IDs, or
traveler PII in the local MinIO volume under a pre-production auth system —
unchanged by this milestone, just still worth saying.

### apps/admin's dev server (host-only workflow)

Covers `apps/admin`'s `vite.config.ts` — relevant whether you're running it
via `pnpm dev` and reaching it *through* `https://atlora.localhost` (Caddy
would need to route `/admin/*` back to `host.docker.internal:3002` with
`handle`, not `handle_path`, for that path to be live; it isn't by default
post-Milestone-5, see [apps/admin container](#appsadmin-container-milestone-5)
for what answers there now) or hitting it *directly* at
`http://localhost:3002/admin/...`, bypassing Caddy entirely.

`base: '/admin/'` makes both entries render and resolve their assets
correctly under that prefix, tRPC calls included, in either case.

`server.proxy` forwards `/api/*` to the host's own `apps/api` (port 3001).
Without it, direct `localhost:3002` access would 404 on every API call —
the admin app's tRPC clients use relative paths (`/api/trpc`, Milestone 5)
so the built container works correctly behind Caddy, but that also means
nothing routes `/api/*` anywhere when there's no Caddy in front at all.
This is dev-only (`server.*` never applies to `vite build`'s output) and
purely additive — the same relative-path code works unmodified whether
Caddy or this proxy config is what's actually resolving `/api/*`. The host
`apps/api` it forwards to already points at the same Docker-hosted
db/MinIO the containerized stack uses (`apps/api/.env`), just via the
host-published ports instead of the internal compose network — so this
doesn't introduce a second, divergent copy of anything to keep in sync.

`server.hmr` is pointed explicitly at `atlora.localhost:443` over `wss` —
without it, the HMR client guesses wrong because the browser never sees the
dev server's real host/port, only Caddy's (only matters when reached
through the proxy; direct access doesn't need this to guess correctly).

Also required: `server.host: true`. Vite binds to `localhost` only by
default; `host.docker.internal` (how Caddy reaches the host) resolves to
the host's real network interface, not `127.0.0.1`, so without this every
request through the proxy gets "connection refused". If you ever see that
error for a *new* app you're wiring up the same way, this is almost
certainly why.

### apps/admin container (Milestone 5)

`apps/admin/Dockerfile` builds static assets (`turbo prune` → `pnpm install`
→ `vite build`) and serves them from a second, much smaller stage — plain
`caddy:2-alpine` as a static file server, not Node — using
`apps/admin/Caddyfile`. Simpler than `apps/api`'s Dockerfile: Vite bundles
workspace packages' raw TypeScript directly (esbuild), so there's no
analogue of `apps/api`'s "raw TS can't run under plain node" problem and no
build-time package.json patching needed here.

**The three bugs the Docker handoff warns about, and their actual fixes:**

1. **Deep-link refresh 404s.** A static file server has no client-side
   router to fall back to — a fresh request for `/admin/catalog/destinations`
   isn't a real file. `apps/admin/Caddyfile` uses `try_files {path}
   /index.html` (and `/platform.html` for the platform sub-entry) so
   anything that isn't a real built file falls back to the right shell.
   Verified in [checklist item 3](#3-admin-app-both-entries).
2. **Assets 404 under the subpath.** Already handled — `vite.config.ts`'s
   `base: '/admin/'` (pulled forward in Milestone 1) means the built
   `index.html`/`platform.html` already reference `/admin/assets/...`
   correctly; nothing new needed here for the container specifically.
3. **HMR websocket fails through the proxy.** Doesn't apply — this is a
   *built* bundle with no dev server, so there's no HMR client to break.

**Two Vite entries, one container, no separate routing rules needed.**
`apps/admin/Caddyfile` has its own `handle_path /admin/platform*` (checked
first) and `handle_path /admin/*` blocks, mirroring the dev-server setup's
logic but inside the container instead of the outer proxy. Because the
container now owns all of that routing, the *outer* `docker/Caddyfile` only
needs one plain `handle /admin/* { reverse_proxy admin:80 }` — no rewrite
hack, no knowledge of the platform sub-entry. `handle`, not `handle_path`:
the built assets reference the full `/admin/...` path, and the container's
own Caddy strips it internally.

**Relative API paths, not `VITE_*` env vars.** `apps/admin/src/main.tsx` and
`src/platform/App.tsx` used to hardcode `http://localhost:3001/trpc`
(flagged in Phase 0). `VITE_*` variables get baked in at build time, so a
containerized SPA can't be reconfigured by changing `docker/compose.yaml`
env vars after the fact — the image would need rebuilding. Relative paths
(`/api/trpc`) sidestep that entirely: single-origin routing through the
proxy means the same built image works correctly regardless of where it's
deployed, no env var needed. This also made the platform client's explicit
`credentials: 'include'` override unnecessary — same-origin fetches send
cookies by default — so it was removed along with the comment explaining a
cross-origin problem that no longer exists.

**No published host port, no `depends_on`, on purpose** — same reasoning
as `api`: a static file server with no backend of its own, reachable only
through the proxy.

`apps/portal`'s equivalent containerization is **not done** — the app
doesn't exist on disk (confirmed in Phase 0). Nothing here generalizes to
it automatically; when it's scaffolded, it needs its own `Dockerfile`,
`Caddyfile`, `base: '/portal/'`, and outer-proxy route, built the same way.

### apps/web container (Milestone 6)

`apps/web/next.config.ts` sets `output: 'standalone'` — a self-contained
server bundle with only the `node_modules` it actually needs, traced by
Next's own file tracer. `apps/web/Dockerfile` builds it in two stages
(`turbo prune` → `pnpm install` → `next build`, then a slim runner copying
just the standalone output) and runs `node apps/web/server.js` as a
non-root user, same shape as `api`'s Dockerfile.

**The monorepo caveat the Docker handoff calls out — verified, not just
configured.** Standalone's tracer needs `outputFileTracingRoot` pointed at
the monorepo root (`path.join(__dirname, '../../')` in `next.config.ts`);
without it, the trace can anchor at the wrong directory and the copied
bundle silently ends up missing workspace dependencies, failing at runtime
with a module-not-found instead of at build time. `apps/web` doesn't
import any workspace package's *runtime* code today (confirmed in
Phase 0 — its two pages are a bare scaffold), so this couldn't be verified
against real app code as-is. To actually test the failure mode the config
exists to prevent: temporarily imported a real `@atlora/ui` component into
`page.tsx`, rebuilt, and confirmed the standalone server ran it correctly
end-to-end (its Tailwind classes showed up in the rendered HTML) before
reverting the page back to its original scaffold — the fix works, not just
"looks right."

**Why there's no build-time patching here, unlike `apps/api`.** `@atlora/ui`
and `@atlora/types` are raw TypeScript too (same pattern as everywhere else
in this repo), but `next.config.ts`'s `transpilePackages: ['@atlora/ui']`
tells Next to transpile and inline that package directly into its own
build output at compile time — it's never `require()`'d as a real package
at runtime, so there's nothing to repoint the way
`docker/scripts/patch-workspace-exports.js` does for `apps/api`.

**Two things `output: 'standalone'` does NOT include, copied explicitly in
the Dockerfile:** `.next/static/` (JS/CSS chunks) and `public/` (static
files). Forgetting either is a well-known Next footgun — assets 404 in the
container while working fine in `next dev`. `apps/web` has no `public/`
directory today; add a `COPY` for it in the Dockerfile if one is ever
introduced.

**What's being given up, per the handoff.** `specs/ARCHITECTURE.md` leans
on ISR for destination/advisor profile pages. Self-hosted Next.js supports
ISR, but the cache is per-container and on local disk — no shared cache
across replicas, no edge distribution, no automatic image-optimization CDN.
Not a problem yet (no ISR pages exist), and deliberately not solved here —
no cache-sharing layer, per the handoff's explicit instruction not to build
one.

**No published host port, no `depends_on`** — `apps/web` makes no API
calls yet, so unlike `api`/`admin` there isn't even a startup-ordering
reason to add one; same "proxy-only" reasoning regardless.

---

## Troubleshooting

**Everything that was working suddenly gives connection errors / 500s
about the database, with no code change to explain it.** Check whether
Docker Desktop itself is still running before debugging anything else —
```bash
docker compose -f docker/compose.yaml ps -a
```
If every container shows `Exited` at roughly the same timestamp, Docker
Desktop isn't running (quit, machine slept/shut down, or stopped
manually) and took every container down with it. Your data is untouched —
a plain exit isn't `down -v` — just start Docker Desktop back up if needed,
then:
```bash
docker compose -f docker/compose.yaml up -d
```

**`https://atlora.localhost/admin` (or `/api`, `/portal`) 404s, but the
trailing-slash form works fine.** Caddy's `/admin/*`-style matchers
require the trailing slash — the bare path matches none of them and falls
through to the `web` catch-all, which then correctly 404s since Next.js
has no route for it (the giveaway: the 404 page's `<title>` says "Atlora
Travel", not whatever the app you meant to reach would show). Fixed with
explicit `redir ... 308` rules at the top of `docker/Caddyfile` for these
bare paths — if this regresses, one of those got removed. There's no
`/ai` equivalent — see the [AI suite](#ai-suite) note for why that route
doesn't exist at all.

**Edited `docker/Caddyfile` but the change doesn't seem to apply.**
`docker compose exec proxy caddy reload` can fail with `open
/etc/caddy/Caddyfile: no such file or directory` even though `ls` shows the
file — this is a stale bind-mount handle after an editor replaces the file
via write-then-rename rather than editing in place. Restart the container
instead of reloading in-place:
```bash
docker compose -f docker/compose.yaml restart proxy
```

**`dial tcp ...: connect: connection refused` in `docker compose logs proxy`.**
The upstream dev server isn't listening on an interface `host.docker.internal`
can reach — see the `server.host: true` note above. Next.js binds `0.0.0.0`
by default; Vite does not.

**Admin page loads but is blank / console shows module 404s.**
The served HTML is requesting assets from the site root instead of
`/admin/*` — `base` isn't set (or isn't set to match the Caddy route) in that
app's `vite.config.ts`.

**Browser shows `net::ERR_CERT_AUTHORITY_INVALID` and nothing renders.**
Expected in any browser profile that hasn't trusted Caddy's local CA yet
(including automated/sandboxed browser tooling) — see
[Browser certificate warning](#browser-certificate-warning). Not an app bug;
confirm with `curl -sk` (which ignores cert validity) if you need to rule out
an actual regression first.

**`psql: command not found`.** Postgres.app doesn't put `psql` on `PATH` by
default. Use the full path (adjust the version number to match what's
installed):
```bash
/Applications/Postgres.app/Contents/Versions/18/bin/psql "postgresql://postgres:postgres@localhost:5433/atlora"
```

**`error: permission denied for schema public` running `pnpm db:migrate`.**
`packages/db/.env`'s `DATABASE_URL` isn't `atlora_owner` — drizzle-kit needs
DDL rights (`CREATE SCHEMA`, `CREATE TABLE`) that only that role has. Also
check it's pointed at `:5433` (the container), not `:5432` (a stray host
Postgres).

**`error: permission denied for table ...` from the running API.**
`apps/api/.env`'s `DATABASE_URL` isn't `atlora_app`, or migrations haven't
been applied against the container yet (`pnpm db:migrate`) so the table
doesn't exist / has no grants.

**`migrate` container exits 1 with `Cannot find module '.../drizzle-kit/
bin.cjs'`.** Something changed the Dockerfile so `migrate`'s `target:
installer` no longer has devDependencies — `drizzle-kit` is one. Don't move
the prod-only `pnpm install --prod` reinstall into the `installer` stage;
it belongs in `runner` only. See
[apps/api container](#appsapi-container-milestone-3).

**`Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../dist/index'`
running a built `apps/api` with plain `node`.** The build didn't go through
`tsconfig.build.json` (CommonJS) — check `apps/api/package.json`'s `build`
script is `tsc -p tsconfig.build.json`, not bare `tsc`. See
[apps/api container](#appsapi-container-milestone-3) for why this matters.

**A `docker build` step silently does less than expected and moves on
(no error, but nothing looks changed).** Check if it's a prompt waiting on
stdin that non-interactive `docker build` can't answer — `pnpm prune --prod`
does exactly this. Look for the step finishing suspiciously fast for what
it claims to do.

**`Error: MINIO_ENDPOINT is not set` (or any other `<VAR> is not set`) when
`api` starts.** `lib/storage/index.ts` fails fast on a missing var for
whichever `STORAGE_DRIVER` is active, rather than limping along with a
broken client. Check `apps/api/.env` (host) has every `MINIO_*`/`R2_*` var
its active driver needs, and for the container, that
`docker/compose.yaml`'s `api.environment` block wasn't trimmed.

**`SignatureDoesNotMatch` (or similar) trying to use an uploaded/signed
URL.** `MINIO_ENDPOINT` and `MINIO_PUBLIC_ENDPOINT` got swapped, or the
container's `MINIO_PUBLIC_ENDPOINT` was changed to the internal
`http://storage:9000` — the signed URL's host has to be the one the
requester (a browser) will actually hit, which is always `localhost:9000`
here. See [Storage module](#storage-module-milestone-4).

**`Cannot find module '@atlora/ui'` (or similar) starting the containerized
`apps/web`.** `next.config.ts`'s `outputFileTracingRoot` isn't pointed at
the monorepo root, so Next's standalone tracer anchored somewhere that
doesn't see the workspace packages — see
[apps/web container](#appsweb-container-milestone-6). If this ever comes
back after touching `next.config.ts`, the cheapest way to confirm the fix
still works is the same one used to verify it originally: temporarily
import a real `@atlora/ui` component into a page, rebuild, and check it
actually renders in the container.

---

## Resetting the database volume

Init scripts under `docker/init/` only run once, against a freshly-created
(empty) volume. If you add or change one after the fact, or just want a clean
slate:

```bash
docker compose -f docker/compose.yaml down -v
docker compose -f docker/compose.yaml up -d --build
pnpm --filter @atlora/api cli:platform-user create \
  --email you@example.com --password 'SomeTestPassword123!' \
  --name "Your Name" --role platform_admin
```

`-v` drops the named volumes (`db_data`, `storage_data`, `caddy_data`,
`caddy_config`) — this deletes all local Postgres and MinIO data, including
the roles from `docker/init/01-roles.sql` (they get recreated on the next
`up`) and every platform user. Migrations reapply automatically (the
`migrate` service runs on every `up`, see [checklist item
9](#9-migration-service-applied-cleanly)) — only the platform-admin CLI step
afterward is still manual, since nothing else creates one.

## Stopping

```bash
docker compose -f docker/compose.yaml down
```

Add `-v` only if you also want to wipe the volumes (see above).
