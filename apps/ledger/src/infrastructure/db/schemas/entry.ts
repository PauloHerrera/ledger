import {
  pgTable,
  uuid,
  serial,
  text,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { journal } from "./journal";
import { account } from "./account";
import { operationTypeEnum } from "./enums";
import type { EntryDTO } from "../../../presentation/validators/entrySchema";

export const entry = pgTable("entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: serial(),
  journalId: uuid("journal_id").references(() => journal.id),
  accountId: uuid("account_id").references(() => account.id),
  description: text("description"),
  amount: numeric({ precision: 20, scale: 2 }),
  direction: operationTypeEnum("direction").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const journalRelations = relations(entry, ({ one }) => ({
  journal: one(journal, {
    fields: [entry.journalId],
    references: [journal.id],
  }),
}));

export const accountRelations = relations(entry, ({ one }) => ({
  account: one(account, {
    fields: [entry.accountId],
    references: [account.id],
  }),
}));

export type Entry = typeof entry.$inferSelect;
export type NewEntry = typeof entry.$inferInsert;

export const mapDTOToEntries = (
  data: EntryDTO[],
  journalId: string
): NewEntry[] => {
  return data.map((entry) => ({
    ...entry,
    journalId,
    amount: entry.amount.toString(),
  }));
};
