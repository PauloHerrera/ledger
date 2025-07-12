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
    const whereClause = filters?.ledgerId
      ? eq(account.ledgerId, filters.ledgerId)
      : undefined;

    const result = await this.db.select().from(account).where(whereClause);
    return result as Account[];
  }
}
