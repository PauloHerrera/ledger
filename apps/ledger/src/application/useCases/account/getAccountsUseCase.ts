import type { IAccountRepository } from "../../../infrastructure/repositories/accountRepository";
import type { Account } from "../../../infrastructure/db/schemas/account";

export interface GetAccountsFilters {
  ledgerId?: string;
}

export default class GetAccountsUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(filters?: GetAccountsFilters): Promise<Account[]> {
    try {
      const accounts = await this.accountRepository.findAll(filters);
      return accounts;
    } catch (error) {
      throw new Error(`Failed to fetch accounts: ${error}`);
    }
  }
}
