import { pgTable, uuid, numeric, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { loanStatusEnum } from "./enums";
import { borrower } from "./borrower";

export const loan = pgTable("loans", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: loanStatusEnum("status").notNull().default("pending"),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  interestRate: numeric("interest_rate", { precision: 5, scale: 4 }).notNull(),
  borrowerId: uuid("borrower_id").references(() => borrower.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const loanRelations = relations(loan, ({ one }) => ({
  borrower: one(borrower, {
    fields: [loan.borrowerId],
    references: [borrower.id],
  }),
}));

export type Loan = typeof loan.$inferSelect;
export type NewLoan = typeof loan.$inferInsert;