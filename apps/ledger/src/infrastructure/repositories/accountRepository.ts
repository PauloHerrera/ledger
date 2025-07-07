import type { Database } from "../db";
import { account, type Account, type NewAccount } from "../db/schemas/account";
import { BaseRepository, type IBaseRepository } from "./baseRepository";
import { eq } from "drizzle-orm";

export interface IAccountRepository
  extends IBaseRepository<Account, NewAccount> {}

export class AccountRepository
  extends BaseRepository<Account, NewAccount>
  implements IAccountRepository
{
  constructor(db: Database) {
    super(db, account);
  }

  override async findAll(filters?: { ledgerId?: string }): Promise<Account[]> {
    if (filters?.ledgerId) {
      // If ledgerId filter is provided, return all accounts from that ledger
      const result = await this.db
        .select()
        .from(account)
        .where(eq(account.ledgerId, filters.ledgerId));
      return result as Account[];
    }
    
    // If no filters, return all accounts
    const result = await this.db.select().from(account);
    return result as Account[];
  }
}
