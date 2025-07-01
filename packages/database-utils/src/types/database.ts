import type { PgDatabase } from "drizzle-orm/pg-core";

export type Database = PgDatabase<Record<string, never>>;