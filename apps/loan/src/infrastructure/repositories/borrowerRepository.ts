import type { Database } from "@repo/database-utils";
import { borrower, type Borrower, type NewBorrower } from "../db/schemas/borrower";
import { BaseRepository, type IBaseRepository } from "@repo/database-utils";

export interface IBorrowerRepository
  extends IBaseRepository<Borrower, NewBorrower> {}

export class BorrowerRepository
  extends BaseRepository<Borrower, NewBorrower>
  implements IBorrowerRepository
{
  constructor(db: Database) {
    super(db, borrower);
  }
}