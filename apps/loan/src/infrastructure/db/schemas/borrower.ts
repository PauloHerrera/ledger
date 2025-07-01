import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const borrower = pgTable("borrowers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  document: text("document").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Borrower = typeof borrower.$inferSelect;
export type NewBorrower = typeof borrower.$inferInsert;