import type { Database } from "../db";
import { account, type Account, type NewAccount } from "../db/schemas/account";
import { BaseRepository, type IBaseRepository } from "./baseRepository";

export interface IAccountRepository
  extends IBaseRepository<Account, NewAccount> {}

export class AccountRepository
  extends BaseRepository<Account, NewAccount>
  implements IAccountRepository
{
  constructor(db: Database) {
    super(db, account);
  }
}
