import {
  pgTable,
  uuid,
  integer,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { ledger } from "./ledger";
import { relations } from "drizzle-orm";

export const journal = pgTable("journal", {
  id: uuid("id").primaryKey().defaultRandom(),
  ledgerId: uuid("ledger_id").notNull().references(() => ledger.id),
  code: integer("code").notNull(),
  name: text("journal_name").notNull(),
  description: text("description"),
  journalEvent: text("journal_event").notNull(),
  metadata: jsonb("metadata"),
  postingDate: timestamp("posting_date").notNull(), // When the event occured
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const journalRelations = relations(journal, ({ one }) => ({
  ledger: one(ledger, {
    fields: [journal.ledgerId],
    references: [ledger.id],
  }),
}));

export type Journal = typeof journal.$inferSelect;
export type NewJournal = typeof journal.$inferInsert;
