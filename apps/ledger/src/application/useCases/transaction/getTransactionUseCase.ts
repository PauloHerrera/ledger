import type { ITransactionRepository } from "../../../infrastructure/repositories/transactionRepository";
import type { Transaction } from "../../../infrastructure/db/schemas/transaction";

export default class GetTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(id: string): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepository.findById(id);
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      return transaction;
    } catch (error) {
      if (error instanceof Error && error.message === "Transaction not found") {
        throw error;
      }
      throw new Error(`Failed to fetch account: ${error}`);
    }
  }
}
