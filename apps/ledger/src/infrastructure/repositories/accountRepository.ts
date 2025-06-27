import type { Database } from "../db";
import { eq } from "drizzle-orm";
import type { Account, NewAccount } from "../db/schemas/account";
import { account } from "../db/schemas/account";

export interface IAccountRepository {
  save(data: NewAccount): Promise<Account>;
  findById(id: string): Promise<Account>;
  findAll(): Promise<Account[]>;
}

export class AccountRepository implements IAccountRepository {
  constructor(private db: Database) {}

  async save(data: NewAccount): Promise<Account> {
    const result = await this.db.insert(account).values(data).returning();
    return result[0] as Account;
  }

  async findById(id: string): Promise<Account> {
    const result = await this.db
      .select()
      .from(account)
      .where(eq(account.id, id));
    return result[0] as Account;
  }

  async findAll(): Promise<Account[]> {
    const result = await this.db.select().from(account);
    return result as Account[];
  }
}
