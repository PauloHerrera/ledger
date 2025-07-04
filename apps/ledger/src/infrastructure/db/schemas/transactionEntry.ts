import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { account } from "./account";
import { operationTypeEnum } from "./enums";
import { relations } from "drizzle-orm";
import { transaction } from "./transaction";

export const transactionEntries = pgTable(
  "transaction_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id").references(() => account.id),
    direction: operationTypeEnum("direction").notNull(),
    amountField: text("amount_field").notNull(),
    transactionId: uuid("transaction_id").references(() => transaction.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("transaction_entries_account_id_idx").on(table.accountId)]
);

export const transactionEntryRelations = relations(
  transactionEntries,
  ({ one }) => ({
    account: one(account, {
      fields: [transactionEntries.accountId],
      references: [account.id],
    }),
  })
);

export type TransactionEntry = typeof transactionEntries.$inferSelect;
export type NewTransactionEntry = typeof transactionEntries.$inferInsert;
