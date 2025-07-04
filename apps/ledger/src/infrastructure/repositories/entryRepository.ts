import type { Database } from "../db";
import { entry, type Entry, type NewEntry } from "../db/schemas/entry";
import type { Account } from "../db/schemas/account";
import type { AccountBalance } from "../../application/types/account";
import { BaseRepository, type IBaseRepository } from "./baseRepository";

export interface IEntryRepository extends IBaseRepository<Entry, NewEntry> {
  createBatch(data: NewEntry[]): void;
  findByJournalIdWithAccount(
    journalId: string
  ): Promise<Array<Entry & { account: Account | null }>>;
  getAccountBalances(filters?: {
    startDate?: Date;
    endDate?: Date;
    ledgerId?: string;
  }): Promise<AccountBalance[]>;
}

export class EntryRepository
  extends BaseRepository<Entry, NewEntry>
  implements IEntryRepository
{
  constructor(db: Database) {
    super(db, entry);
  }

  async createBatch(data: NewEntry[]) {
    await this.db.transaction(async (tx) => {
      data.forEach(async (entryData) => {
        await tx.insert(entry).values(entryData).returning();
      });
    });
  }

  /**
   * Fetch all entries for a journal together with their related account.
   * This performs a left join between the entries and accounts tables and
   * returns an array of objects in the shape:
   *   {
   *     ...entryFields,
   *     account: { ...accountFields }
   *   }
   */
  async findByJournalIdWithAccount(
    journalId: string
  ): Promise<Array<Entry & { account: Account | null }>> {
    // Lazy import to avoid circular deps at top-level
    const { account } = await import("../db/schemas/account");
    const { eq } = await import("drizzle-orm");

    const rows = await this.db
      .select()
      .from(entry)
      .leftJoin(account, eq(entry.accountId, account.id))
      .where(eq(entry.journalId, journalId));

    return rows.map((row: any) => ({
      // row.entries contains the entry columns
      ...(row.entries as Entry),
      // row.accounts may be null if account was deleted
      account: row.accounts ?? null,
    })) as Array<Entry & { account: Account | null }>;
  }

  /**
   * Get account balances grouped by account with totals for debits and credits.
   * Optionally filter by date range and ledger.
   */
  async getAccountBalances(filters?: {
    startDate?: Date;
    endDate?: Date;
    ledgerId?: string;
  }): Promise<AccountBalance[]> {
    // Lazy import to avoid circular deps at top-level
    const { account } = await import("../db/schemas/account");
    const { eq, and, gte, lte, sum, sql } = await import("drizzle-orm");

    // Build dynamic where conditions
    const conditions = [];

    if (filters?.startDate) {
      conditions.push(gte(entry.createdAt, filters.startDate));
    }

    if (filters?.endDate) {
      conditions.push(lte(entry.createdAt, filters.endDate));
    }

    if (filters?.ledgerId) {
      conditions.push(eq(account.ledgerId, filters.ledgerId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await this.db
      .select({
        accountId: account.id,
        accountName: account.name,
        accountType: account.accountType,
        totalAmountDebits: sql<string>`COALESCE(SUM(CASE WHEN ${entry.direction} = 'debit' THEN ${entry.amount} ELSE 0 END), 0)`,
        totalAmountCredits: sql<string>`COALESCE(SUM(CASE WHEN ${entry.direction} = 'credit' THEN ${entry.amount} ELSE 0 END), 0)`,
      })
      .from(entry)
      .innerJoin(account, eq(entry.accountId, account.id))
      .where(whereClause)
      .groupBy(account.id, account.name, account.accountType)
      .orderBy(account.name);

    return results as AccountBalance[];
  }
}
