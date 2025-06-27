import type { Database } from "../db";

import type { Ledger, NewLedger } from "../db/schemas/ledger";
import { eq } from "drizzle-orm";
import { ledger } from "../db/schemas/ledger";

export interface ILedgerRepository {
  save(data: NewLedger): Promise<Ledger | null>;
  findById(id: string): Promise<Ledger | null>;
  findAll(): Promise<Ledger[]>;
}

export class LedgerRepository implements ILedgerRepository {
  constructor(private db: Database) {}

  async save(data: NewLedger): Promise<Ledger | null> {
    if (!data) {
      throw new Error("Ledger is required");
    }

    const result = await this.db.insert(ledger).values(data).returning();
    return result[0] as Ledger;
  }

  async findById(id: string): Promise<Ledger | null> {
    const result = await this.db.select().from(ledger).where(eq(ledger.id, id));
    return result[0] || null;
  }

  async findAll(): Promise<Ledger[]> {
    const result = await this.db.select().from(ledger);
    return result as Ledger[];
  }
}
