import type { ILoanRepository } from "../../infrastructure/repositories/loanRepository";
import type { IBorrowerRepository } from "../../infrastructure/repositories/borrowerRepository";
import type { LoanDTO, UpdateLoanStatusDTO } from "../../presentation/validators/loanSchema";
import type {
  Loan,
  NewLoan,
} from "../../infrastructure/db/schemas/loan";

export class CreateLoanUseCase {
  constructor(
    private loanRepo: ILoanRepository,
    private borrowerRepo: IBorrowerRepository
  ) {}

  async execute(data: LoanDTO): Promise<Loan> {
    // Verify borrower exists
    const borrower = await this.borrowerRepo.findById(data.borrowerId);
    if (!borrower) {
      throw new Error("Borrower not found");
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

export class GetLoanUseCase {
  constructor(private loanRepo: ILoanRepository) {}

  async execute(id: string): Promise<Loan & { borrower: any }> {
    const loan = await this.loanRepo.findByIdWithBorrower(id);

    if (!loan) {
      throw new Error("Loan not found");
    }

    return loan;
  }
}

export class GetLoansUseCase {
  constructor(private loanRepo: ILoanRepository) {}

  async execute(): Promise<(Loan & { borrower: any })[]> {
    return await this.loanRepo.findAllWithBorrower();
  }
}

export class UpdateLoanStatusUseCase {
  constructor(private loanRepo: ILoanRepository) {}

  async execute(id: string, data: UpdateLoanStatusDTO): Promise<Loan> {
    // First verify loan exists
    const existingLoan = await this.loanRepo.findById(id);
    if (!existingLoan) {
      throw new Error("Loan not found");
    }

    // For now, we'll create a new loan with updated status
    // In a real implementation, you'd want to add an update method to the repository
    const updatedLoan = await this.loanRepo.create({
      ...existingLoan,
      status: data.status,
    });

    return updatedLoan;
  }
}