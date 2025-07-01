import type { ILoanRepository } from "../../../infrastructure/repositories/loanRepository";
import type { IBorrowerRepository } from "../../../infrastructure/repositories/borrowerRepository";
import type { LoanDTO } from "../../../presentation/validators/loanSchema";
import type { Loan, NewLoan } from "../../../infrastructure/db/schemas/loan";

export default class CreateLoanUseCase {
  constructor(
    private loanRepo: ILoanRepository,
    private borrowerRepo: IBorrowerRepository
  ) {}

  async execute(data: LoanDTO): Promise<Loan> {
    // Verify borrower exists
    let borrower = await this.borrowerRepo.findById(data.borrowerId);
    if (!borrower) {
      borrower = await this.borrowerRepo.create({
        id: data.borrowerId,
        name: data.borrowerName,
        document: data.borrowerDocument,
      });
    }

    const loan = await this.loanRepo.create(this.mapDTOToLoan(data));

    if (!loan) {
      throw new Error("Failed to create loan");
    }

    return loan;
  }

  private mapDTOToLoan(data: LoanDTO): NewLoan {
    return {
      amount: data.amount,
      interestRate: data.interestRate,
      borrowerId: data.borrowerId,
      status: data.status || "pending",
    };
  }
}
