// Loads apps/api/.env the same way `tsx --env-file .env` does for dev/CLI
// scripts, since vitest doesn't pick that flag up itself. Requires
// DATABASE_URL pointing at a real (local/scratch) Postgres — the auth
// integration tests exercise real schema and real transactions rather than
// mocking the DB layer.
process.loadEnvFile('.env')
