import type { ITransactionRepository } from "../../../infrastructure/repositories/transactionRepository";
import type {
  NewTransaction,
  Transaction,
} from "../../../infrastructure/db/schemas/transaction";
import type { TransactionDTO } from "../../../presentation/validators/transactionSchema";
import type { ITransactionEntryRepository } from "../../../infrastructure/repositories/transactionEntryRepository";
import type { IAccountRepository } from "../../../infrastructure/repositories/accountRepository";

export default class CreateTransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private transactionEntryRepository: ITransactionEntryRepository,
    private accountRepository: IAccountRepository
  ) {}

  async execute(data: TransactionDTO): Promise<Transaction> {
    try {
      await this.validateAccounts(data.entries);

      const transaction = await this.transactionRepository.create(
        this.mapDTOToTransaction(data)
      );

      const entries = data.entries.map((entry) => ({
        ...entry,
        transactionId: transaction.id,
      }));

      await this.transactionEntryRepository.createBatch(entries);

      return transaction;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  private async validateAccounts(
    entries: TransactionDTO["entries"]
  ): Promise<void> {
    const uniqueAccountIds = [
      ...new Set(entries.map((entry) => entry.accountId)),
    ];

    for (const accountId of uniqueAccountIds) {
      const account = await this.accountRepository.findById(accountId);
      if (!account) {
        throw new Error(`Account with ID ${accountId} not found`);
      }
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
