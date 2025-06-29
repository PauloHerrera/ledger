import {
  pgTable,
  uuid,
  serial,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export const journal = pgTable("journal", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: serial(),
  name: text("journal_name").notNull(),
  description: text("description"),
  journalEvent: text("journal_event").notNull(),
  metadata: jsonb("metadata"),
  postingDate: timestamp("posting_date").notNull(), // When the event occured
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Journal = typeof journal.$inferSelect;
export type NewJournal = typeof journal.$inferInsert;
