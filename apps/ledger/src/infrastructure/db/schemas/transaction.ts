import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ledger } from "./ledger";
import { transactionEntries, type TransactionEntry } from "./transactionEntry";

export const transaction = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventType: text("event_type").notNull(),
    description: text("description"),
    ledgerId: uuid("ledger_id").references(() => ledger.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("transactions_event_type_idx").on(table.eventType)]
);

export const transactionRelations = relations(transaction, ({ many, one }) => ({
  entries: many(transactionEntries),
  ledger: one(ledger, {
    fields: [transaction.ledgerId],
    references: [ledger.id],
  }),
}));

export type Transaction = typeof transaction.$inferSelect;
export type NewTransaction = typeof transaction.$inferInsert;

export type CompleteTransaction = Transaction & {
  entries: Array<TransactionEntry>;
};
