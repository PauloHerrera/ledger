import type { IBorrowerRepository } from "../../infrastructure/repositories/borrowerRepository";
import type { BorrowerDTO } from "../../presentation/validators/borrowerSchema";
import type {
  Borrower,
  NewBorrower,
} from "../../infrastructure/db/schemas/borrower";

export class CreateBorrowerUseCase {
  constructor(private borrowerRepo: IBorrowerRepository) {}

  async execute(data: BorrowerDTO): Promise<Borrower> {
    const borrower = await this.borrowerRepo.create(this.mapDTOToBorrower(data));

    if (!borrower) {
      throw new Error("Failed to create borrower");
    }

    return borrower;
  }

  private mapDTOToBorrower(data: BorrowerDTO): NewBorrower {
    return {
      name: data.name,
      document: data.document,
    };
  }
}

export class GetBorrowerUseCase {
  constructor(private borrowerRepo: IBorrowerRepository) {}

  async execute(id: string): Promise<Borrower> {
    const borrower = await this.borrowerRepo.findById(id);

    if (!borrower) {
      throw new Error("Borrower not found");
    }

    return borrower;
  }
}

export class GetBorrowersUseCase {
  constructor(private borrowerRepo: IBorrowerRepository) {}

  async execute(): Promise<Borrower[]> {
    return await this.borrowerRepo.findAll();
  }
}