import type { Database } from "../db";
import { entry, type Entry, type NewEntry } from "../db/schemas/entry";
import type { Account } from "../db/schemas/account";
import { BaseRepository, type IBaseRepository } from "./baseRepository";

export interface IEntryRepository extends IBaseRepository<Entry, NewEntry> {
  createBatch(data: NewEntry[]): void;
  findByJournalIdWithAccount(journalId: string): Promise<Array<Entry & { account: Account | null }>>;
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
}
