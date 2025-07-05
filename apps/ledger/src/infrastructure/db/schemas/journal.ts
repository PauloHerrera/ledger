import {
  pgTable,
  uuid,
  serial,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import type { Entry } from "./entry";
import type { Account } from "./account";
import { ledger } from "./ledger";
import { relations } from "drizzle-orm";
import type { JournalDTO } from "../../../presentation/validators/journalSchema";

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
  ledgerId: uuid("ledger_id").references(() => ledger.id),
});

export const journalRelations = relations(journal, ({ one }) => ({
  ledger: one(ledger, {
    fields: [journal.ledgerId],
    references: [ledger.id],
  }),
}));

export type Journal = typeof journal.$inferSelect;
export type NewJournal = typeof journal.$inferInsert;

export type CompleteJournal = Journal & {
  entries: Array<Entry & { account: Account | null }>;
};

export const mapDTOToJournal = (data: JournalDTO): NewJournal => {
  return {
    id: data.transactionId,
    name: data.name || data.event,
    journalEvent: data.event,
    description: data.description,
    postingDate: new Date(data.postingDate),
    metadata: data.metadata,
    ledgerId: data.ledgerId,
  };
};
