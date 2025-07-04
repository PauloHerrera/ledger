import { eq } from "drizzle-orm";
import type { Database } from "../db";
import {
  transaction,
  type CompleteTransaction,
  type NewTransaction,
  type Transaction,
} from "../db/schemas/transaction";
import { BaseRepository, type IBaseRepository } from "./baseRepository";

export interface ITransactionRepository
  extends IBaseRepository<Transaction, NewTransaction> {
  findByEventType(eventType: string): Promise<CompleteTransaction | null>;
}

export class TransactionRepository
  extends BaseRepository<Transaction, NewTransaction>
  implements ITransactionRepository
{
  constructor(db: Database) {
    super(db, transaction);
  }

  async findByEventType(
    eventType: string
  ): Promise<CompleteTransaction | null> {
    const result = await this.db.query.transaction.findFirst({
      where: eq(transaction.eventType, eventType),
      with: {
        entries: true,
      },
    });

    return result || null;
  }
}
