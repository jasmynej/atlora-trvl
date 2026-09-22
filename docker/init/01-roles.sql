-- Milestone 2: three roles, matching the ownership/privilege split RLS
-- depends on structurally, not conventionally.
--
-- The bug this prevents: the default Postgres superuser bypasses RLS
-- entirely, and separately a table's OWNER bypasses its own RLS policies
-- unless the table is declared FORCE ROW LEVEL SECURITY. A default
-- single-role compose setup gives you a role that is both — you write
-- agency-isolation policies, your local tests pass against that role, and
-- the policies are doing nothing. The first time it matters is a
-- cross-tenant leak in a shared environment.
--
--   atlora_owner  — owns the schema and (transitively) every table
--                   drizzle-kit creates. Used ONLY for migrations
--                   (packages/db/.env). Never used by a running app.
--   atlora_app    — runtime connection for apps/api. Ordinary role: no
--                   superuser, no BYPASSRLS, and NOT a table owner — so
--                   once RLS policies exist, they actually apply to it.
--   atlora_ai_ro  — runtime connection for the atlora-ai suite (MCP
--                   server, chatbot, etc.) — a separate, portable
--                   codebase, not an app in this repo. SELECT only, so
--                   "AI is read-only against the database"
--                   (specs/ARCHITECTURE.md) is structurally true rather
--                   than just a convention nobody's enforcing.
--
-- NOTE — deferred scope: this file sets up the roles/grants Milestone 2
-- asks for. It deliberately does NOT add `ENABLE`/`FORCE ROW LEVEL
-- SECURITY` or write the cross-tenant RLS proof — the Phase 0 audit found
-- no agency-scoped table exists yet (only platform_users), so there is
-- nothing real to isolate or prove isolation against. When an
-- agency-owned table lands, add its RLS policies alongside that migration
-- and write the proof described in the Docker handoff's Milestone 2
-- ("The proof") against it.
--
-- Runs once, only against a freshly-created (empty) volume — see
-- docker/init/README.md. Local dev only: passwords intentionally match
-- role names; this database is never exposed beyond localhost.

CREATE ROLE atlora_owner LOGIN PASSWORD 'atlora_owner' NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
CREATE ROLE atlora_app   LOGIN PASSWORD 'atlora_app'   NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
CREATE ROLE atlora_ai_ro LOGIN PASSWORD 'atlora_ai_ro' NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;

-- atlora_owner owns the schema itself, so every object drizzle-kit creates
-- while connected as atlora_owner is owned by atlora_owner — not by the
-- POSTGRES_USER superuser this container bootstraps as.
ALTER SCHEMA public OWNER TO atlora_owner;
GRANT ALL ON SCHEMA public TO atlora_owner;
GRANT USAGE ON SCHEMA public TO atlora_app, atlora_ai_ro;

-- drizzle-kit tracks applied migrations in its own "drizzle" schema and
-- creates it on first run (CREATE SCHEMA IF NOT EXISTS "drizzle"). Schema
-- ownership above doesn't cover that — CREATE on the database itself isn't
-- granted to anyone but the DB owner by default since Postgres 15. Scoped
-- to CREATE only, not full database ownership, so atlora_owner can't drop
-- or rename the database.
GRANT CREATE ON DATABASE atlora TO atlora_owner;

-- Grants for tables/sequences that exist right now. At the point this
-- script runs (fresh volume, before any migration), that's zero — the
-- statements are harmless no-ops today and exist for the case this file is
-- ever re-applied by hand against a database that already has tables (see
-- docker/init/README.md). The mechanism that actually matters for
-- migrations going forward is ALTER DEFAULT PRIVILEGES below.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO atlora_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO atlora_app;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO atlora_ai_ro;

-- Applies to tables/sequences created AFTER this point by atlora_owner
-- (i.e. every future migration). Without this, each new migration
-- silently produces a table atlora_app/atlora_ai_ro can't touch, and the
-- failure surfaces as "permission denied" at runtime instead of at
-- migration time.
ALTER DEFAULT PRIVILEGES FOR ROLE atlora_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO atlora_app;
ALTER DEFAULT PRIVILEGES FOR ROLE atlora_owner IN SCHEMA public
  GRANT USAGE ON SEQUENCES TO atlora_app;
ALTER DEFAULT PRIVILEGES FOR ROLE atlora_owner IN SCHEMA public
  GRANT SELECT ON TABLES TO atlora_ai_ro;
