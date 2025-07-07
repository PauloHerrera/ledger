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

  override async findAll(filters?: { accountId?: string }): Promise<Account[]> {
    if (filters?.accountId) {
      // If accountId filter is provided, return that specific account
      const result = await this.db
        .select()
        .from(account)
        .where(eq(account.id, filters.accountId));
      return result as Account[];
    }
    
    // If no filters, return all accounts
    const result = await this.db.select().from(account);
    return result as Account[];
  }
}
