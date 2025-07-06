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
      // Validate that all accounts exist and are active
      await this.validateAccountsExist(data.entries);

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
      throw new Error(`Failed to create transaction: ${error}`);
    }
  }

  private async validateAccountsExist(entries: TransactionDTO['entries']): Promise<void> {
    const accountIds = entries.map(entry => entry.accountId);
    const uniqueAccountIds = [...new Set(accountIds)];

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
