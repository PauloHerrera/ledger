import type { AccountType } from "./account";

export interface EntryResponseDTO {
  code: string;
  amount: string;
  direction: "debit" | "credit";
  accountName: string;
  accountType: AccountType;
}
