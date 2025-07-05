import type { Database } from "../db";
import { BaseRepository, type IBaseRepository } from "./baseRepository";
import {
  transactionEntries,
  type NewTransactionEntry,
  type TransactionEntry,
} from "../db/schemas/transactionEntry";

export interface ITransactionEntryRepository
  extends IBaseRepository<TransactionEntry, NewTransactionEntry> {}

export interface ITransactionEntryRepository
  extends IBaseRepository<TransactionEntry, NewTransactionEntry> {
  createBatch(entries: NewTransactionEntry[]): Promise<void>;
}

export class TransactionEntryRepository
  extends BaseRepository<TransactionEntry, NewTransactionEntry>
  implements ITransactionEntryRepository
{
  constructor(db: Database) {
    super(db, transactionEntries);
  }

  async createBatch(entries: NewTransactionEntry[]): Promise<void> {
    await this.db.transaction(async (tx) => {
      entries.forEach(async (entryData) => {
        await tx.insert(transactionEntries).values(entryData).returning();
      });
    });
  }
}
