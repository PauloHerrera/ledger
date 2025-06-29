import type { Database } from "../db";
import { BaseRepository, type IBaseRepository } from "./baseRepository";
import { ledger, type Ledger, type NewLedger } from "../db/schemas/ledger";

export interface ILedgerRepository extends IBaseRepository<Ledger, NewLedger> {}

export class LedgerRepository
  extends BaseRepository<Ledger, NewLedger>
  implements ILedgerRepository
{
  constructor(db: Database) {
    super(db, ledger);
  }
}
