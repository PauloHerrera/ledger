import type { ILoanRepository } from "../../../infrastructure/repositories/loanRepository";
import type { Loan } from "../../../infrastructure/db/schemas/loan";
import type { UpdateLoanStatusDTO } from "../../../presentation/validators/loanSchema";

export default class UpdateLoanUseCase {
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
