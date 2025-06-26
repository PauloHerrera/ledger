import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { accountTypeEnum } from "./enums";
export const account = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  accountType: accountTypeEnum("account_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
