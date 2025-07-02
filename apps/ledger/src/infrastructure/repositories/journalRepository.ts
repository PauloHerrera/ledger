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
    const result = await this.db
      .select()
      .from(journal)
      .where(eq(journal.ledgerId, ledgerId));

    return result as Journal[];
  }
}
