import { db } from "../index";
import { account, type NewAccount } from "../schemas/account";
import { ledger } from "../schemas/ledger";
import { eq } from "drizzle-orm";
export const createAccount = async (data: NewAccount) => {
  const [createdAccount] = await db.insert(account).values(data).returning();
  return createdAccount;
};

export const getAccounts = async (): Promise<
  Array<{
    id: string;
    name: string;
    ledgerName: string;
  }>
> => {
  const accounts = await db
    .select({
      id: account.id,
      name: account.name,
      ledgerName: ledger.name || "",
    })
    .from(account)
    .leftJoin(ledger, eq(account.ledgerId, ledger.id));

  return accounts as Array<{
    id: string;
    name: string;
    ledgerName: string;
  }>;
};
