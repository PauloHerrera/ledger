import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { accountTypeEnum } from "./enums";
import { ledger } from "./ledger";
import { relations } from "drizzle-orm";

export const account = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  accountType: accountTypeEnum("account_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  ledgerId: uuid("ledger_id").references(() => ledger.id),
});

export const accountRelations = relations(account, ({ one }) => ({
  ledger: one(ledger, {
    fields: [account.ledgerId],
    references: [ledger.id],
  }),
}));

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
