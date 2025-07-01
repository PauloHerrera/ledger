import type { ILoanRepository } from "../../../infrastructure/repositories/loanRepository";
import type { Loan } from "../../../infrastructure/db/schemas/loan";

export default class GetLoansUseCase {
  constructor(private loanRepo: ILoanRepository) {}

  async execute(): Promise<(Loan & { borrower: any })[]> {
    return await this.loanRepo.findAllWithBorrower();
  }
}
