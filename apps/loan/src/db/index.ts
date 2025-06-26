import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connStr = process.env.DATABASE_URL;

if (!connStr) {
  throw new Error("DATABASE_URL is not set");
}

export const client = postgres(connStr, { prepare: false });

export const db = drizzle(client);

export type Database = typeof db;
