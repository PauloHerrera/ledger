import type { ILoanRepository } from "../../../infrastructure/repositories/loanRepository";
import type { Loan } from "../../../infrastructure/db/schemas/loan";

export default class GetLoanUseCase {
  constructor(private loanRepo: ILoanRepository) {}

  async execute(id: string): Promise<Loan & { borrower: any }> {
    const loan = await this.loanRepo.findByIdWithBorrower(id);

    if (!loan) {
      throw new Error("Loan not found");
    }

    return loan;
  }
}
