import type { Database } from "../db";
import { journal, type Journal, type NewJournal } from "../db/schemas/journal";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { BaseRepository, type IBaseRepository } from "./baseRepository";
import type { GetJournalsFilters } from "../../application/useCases/journal/getJournalsUseCase";

export interface IJournalRepository
  extends IBaseRepository<Journal, NewJournal> {
  findByLedgerId(ledgerId: string): Promise<Journal[]>;
  findWithFilters(filters?: GetJournalsFilters): Promise<Journal[]>;
}

export class JournalRepository
  extends BaseRepository<Journal, NewJournal>
  implements IJournalRepository
{
  constructor(db: Database) {
    super(db, journal);
  }

  async findByLedgerId(ledgerId: string): Promise<Journal[]> {
    const result = await this.db
      .select()
      .from(journal)
      .where(eq(journal.ledgerId, ledgerId));

    return result as Journal[];
  }

  async findWithFilters(filters?: GetJournalsFilters): Promise<Journal[]> {
    const conditions = [];

    if (filters?.startDate) {
      conditions.push(gte(journal.postingDate, filters.startDate));
    }

    if (filters?.endDate) {
      conditions.push(lte(journal.postingDate, filters.endDate));
    }

    if (filters?.ledgerId) {
      conditions.push(eq(journal.ledgerId, filters.ledgerId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await this.db
      .select()
      .from(journal)
      .where(whereClause)
      .orderBy(desc(journal.code));

    return result as Journal[];
  }
}
