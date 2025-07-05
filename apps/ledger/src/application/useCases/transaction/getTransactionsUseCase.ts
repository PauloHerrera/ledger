import type { ITransactionRepository } from "../../../infrastructure/repositories/transactionRepository";
import type { CompleteTransaction } from "../../../infrastructure/db/schemas/transaction";

export default class GetTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(event: string): Promise<CompleteTransaction | null> {
    try {
      const transactions =
        await this.transactionRepository.findByEventType(event);

      if (!transactions) {
        throw new Error("Transactions not found");
      }

      return transactions;
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error}`);
    }
  }
}
