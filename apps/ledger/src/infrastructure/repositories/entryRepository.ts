import type { Database } from "../db";
import { entry, type Entry, type NewEntry } from "../db/schemas/entry";
import { BaseRepository, type IBaseRepository } from "./baseRepository";

export interface IEntryRepository extends IBaseRepository<Entry, NewEntry> {
  createBatch(data: NewEntry[]): void;
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
}
