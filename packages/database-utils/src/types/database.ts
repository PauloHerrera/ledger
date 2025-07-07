import type { PgDatabase } from "drizzle-orm/pg-core";

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

// Extend the existing Database type to implement IDB
export type Database = PgDatabase<Record<string, never>> & IDB;