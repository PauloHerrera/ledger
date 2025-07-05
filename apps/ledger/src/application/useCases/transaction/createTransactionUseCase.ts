import type { ITransactionRepository } from "../../../infrastructure/repositories/transactionRepository";
import type {
  NewTransaction,
  Transaction,
} from "../../../infrastructure/db/schemas/transaction";
import type { TransactionDTO } from "../../../presentation/validators/transactionSchema";
import type { ITransactionEntryRepository } from "../../../infrastructure/repositories/transactionEntryRepository";

export default class CreateTransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private transactionEntryRepository: ITransactionEntryRepository
  ) {}

  async execute(data: TransactionDTO): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepository.create(
        this.mapDTOToTransaction(data)
      );

      //TODO Add account validation: check if account exists and is active
      const entries = data.entries.map((entry) => ({
        ...entry,
        transactionId: transaction.id,
      }));

      await this.transactionEntryRepository.createBatch(entries);

      return transaction;
    } catch (error) {
      throw new Error(`Failed to create account: ${error}`);
    }
  }

  private mapDTOToTransaction(data: TransactionDTO): NewTransaction {
    return {
      eventType: data.eventType,
      description: data.description,
      status: data.status || "active",
      ledgerId: data.ledgerId,
    };
  }
}
