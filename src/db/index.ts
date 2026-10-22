import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
}

function createDb() {
  return drizzle({ connection: process.env.DATABASE_URL!, schema });
}

// Reuse one connection pool across hot reloads in development.
const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof createDb>;
};

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
