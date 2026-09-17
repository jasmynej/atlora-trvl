# `docker/init/`

Mounted read-only at `/docker-entrypoint-initdb.d` on the `db` container. Postgres
runs every `*.sql`/`*.sh` file here, in lexical order, but **only** the first time
the container starts against an empty data volume — not on every restart.

## `01-roles.sql`

Creates the three roles Milestone 2 asks for (`atlora_owner`, `atlora_app`,
`atlora_ai_ro`) and their grants — see the comment block at the top of that
file for what each is for. Deliberately does **not** add
`ENABLE`/`FORCE ROW LEVEL SECURITY` or the cross-tenant RLS proof: there's no
agency-scoped table yet to write real policies against (only
`platform_users` exists). Add both when an agency-owned table lands.

If you edit this file after the `db` volume already has data, it will **not**
re-run automatically — reset the volume first (`docker compose down -v`, see
`docker/README.md`) or apply the changed statements by hand with `psql`.
