import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "./relations";

const globalForDb = globalThis as unknown as { pool?: Pool };

function createPool() {
  return new Pool({ connectionString: process.env.DATABASE_URL });
}

const pool = globalForDb.pool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = drizzle({
  client: pool,
  relations,
  logger: process.env.NODE_ENV === "development",
});

export * from "./schema";
