export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "income"
  | "expense";

export interface AccountBalance {
  accountId: string;
  accountName: string;
  accountType: string;
  totalAmountDebits: string;
  totalAmountCredits: string;
}
