import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// Core database interface for dependency injection
export interface IDB {
  // Basic operations that repositories need
  insert: (table: any) => any;
  select: () => any;
  update: (table: any) => any;
  delete: (table: any) => any;
  
  // Transaction support
  transaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
  
  // Query API for complex queries
  query: Record<string, any>;
}

const connStr = process.env.DATABASE_URL;

if (!connStr) {
  throw new Error("DATABASE_URL is not set");
}

export const client = postgres(connStr, { prepare: false });

export const db = drizzle(client);

export type Database = typeof db;