import type { IAccountRepository } from "../../infrastructure/repositories/accountRepository";
import type { AccountDTO } from "../../presentation/validators/accountSchema";
import type {
  Account,
  NewAccount,
} from "../../infrastructure/db/schemas/account";

export default class CreateAccountUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(data: AccountDTO): Promise<Account> {
    try {
      const account = await this.accountRepository.create(this.mapDTOToAccount(data));
      return account;
    } catch (error) {
      throw new Error(`Failed to create account: ${error}`);
    }
  }

  private mapDTOToAccount(data: AccountDTO): NewAccount {
    return {
      name: data.name,
      description: data.description,
      accountType: data.accountType,
      ledgerId: data.ledgerId,
    };
  }
}

export class GetAccountUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(id: string): Promise<Account> {
    try {
      const account = await this.accountRepository.findById(id);
      if (!account) {
        throw new Error("Account not found");
      }
      return account;
    } catch (error) {
      if (error instanceof Error && error.message === "Account not found") {
        throw error;
      }
      throw new Error(`Failed to fetch account: ${error}`);
    }
  }
}

export class GetAccountsUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(): Promise<Account[]> {
    try {
      const accounts = await this.accountRepository.findAll();
      return accounts;
    } catch (error) {
      throw new Error(`Failed to fetch accounts: ${error}`);
    }
  }
}
