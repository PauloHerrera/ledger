import type { Database } from "../db";
import { journal, type Journal, type NewJournal } from "../db/schemas/journal";
import { entry } from "../db/schemas/entry";
import { account } from "../db/schemas/account";
import { eq } from "drizzle-orm";
import { BaseRepository, type IBaseRepository } from "./baseRepository";

export interface IJournalRepository
  extends IBaseRepository<Journal, NewJournal> {
  findByLedgerId(ledgerId: string): Promise<Journal[]>;
}

export class JournalRepository
  extends BaseRepository<Journal, NewJournal>
  implements IJournalRepository
{
  constructor(db: Database) {
    super(db, journal);
  }

  /**
   * Find journals that belong to a given ledger by traversing the entries ➜ accounts relationship.
   * A journal is considered to belong to a ledger if at least one of its entries references an
   * account that is linked to the provided ledgerId.
   */
  async findByLedgerId(ledgerId: string): Promise<Journal[]> {
    const rows = await this.db
      .select()
      .from(journal)
      .innerJoin(entry, eq(entry.journalId, journal.id))
      .innerJoin(account, eq(entry.accountId, account.id))
      .where(eq(account.ledgerId, ledgerId));

    // Rows are flat objects containing { journal: {...}, entries: {...}, accounts: {...} }
    // We only need the unique journal objects.
    const map = new Map<string, Journal>();
    rows.forEach((row: any) => {
      const j: Journal = row.journal as Journal;
      if (!map.has(j.id)) {
        map.set(j.id, j);
      }
    });

    return Array.from(map.values());
  }
}
