import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const ledger = pgTable("ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"), // remove?
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Ledger = typeof ledger.$inferSelect;
export type NewLedger = typeof ledger.$inferInsert;
