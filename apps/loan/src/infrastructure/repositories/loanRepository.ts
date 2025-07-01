import { eq } from "drizzle-orm";
import { loan, type Loan, type NewLoan } from "../db/schemas/loan";
import { borrower } from "../db/schemas/borrower";
import { BaseRepository, type IBaseRepository } from "./baseRepository";
import type { Database } from "../db";

export interface ILoanRepository extends IBaseRepository<Loan, NewLoan> {
  findByIdWithBorrower(id: string): Promise<Loan & { borrower: any }>;
  findAllWithBorrower(): Promise<(Loan & { borrower: any })[]>;
}

export class LoanRepository
  extends BaseRepository<Loan, NewLoan>
  implements ILoanRepository
{
  constructor(db: Database) {
    super(db, loan);
  }

  async findByIdWithBorrower(id: string): Promise<Loan & { borrower: any }> {
    const result = await this.db
      .select()
      .from(loan)
      .leftJoin(borrower, eq(loan.borrowerId, borrower.id))
      .where(eq(loan.id, id));

    const row = result[0];
    if (!row) {
      throw new Error("Loan not found");
    }

    return {
      ...row.loans,
      borrower: row.borrowers,
    } as Loan & { borrower: any };
  }

  async findAllWithBorrower(): Promise<(Loan & { borrower: any })[]> {
    const result = await this.db
      .select()
      .from(loan)
      .leftJoin(borrower, eq(loan.borrowerId, borrower.id));

    return result.map((row: any) => ({
      ...row.loans,
      borrower: row.borrowers,
    })) as (Loan & { borrower: any })[];
  }
}
