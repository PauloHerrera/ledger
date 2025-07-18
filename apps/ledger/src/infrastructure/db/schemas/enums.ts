import { pgEnum } from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", [
  "asset",
  "dividends",
  "expense",
  "liability",
  "revenue",
  "equity",
]);

export const operationTypeEnum = pgEnum("operation_tipe", ["debit", "credit"]);

export const transactionStatusEnum = pgEnum("transaction_status", [
  "active",
  "inactive",
  "deleted",
]);
