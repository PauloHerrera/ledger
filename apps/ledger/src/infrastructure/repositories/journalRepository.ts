import type { Database } from "../db";
import { journal, type Journal, type NewJournal } from "../db/schemas/journal";
import { BaseRepository, type IBaseRepository } from "./baseRepository";

export interface IJournalRepository
  extends IBaseRepository<Journal, NewJournal> {}

export class JournalRepository
  extends BaseRepository<Journal, NewJournal>
  implements IJournalRepository
{
  constructor(db: Database) {
    super(db, journal);
  }
}
