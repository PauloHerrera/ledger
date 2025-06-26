import { pgEnum } from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", [
  "asset",
  "dividends",
  "expense",
  "liability",
  "revenue",
  "equity",
]);
