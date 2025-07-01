import { pgEnum } from "drizzle-orm/pg-core";

export const loanStatusEnum = pgEnum("loan_status", [
  "pending",
  "cancelled",
  "lent",
  "settled",
]);