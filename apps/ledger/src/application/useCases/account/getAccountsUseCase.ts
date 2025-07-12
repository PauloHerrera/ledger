import type { IAccountRepository } from "../../../infrastructure/repositories/accountRepository";
import type { Account } from "../../../infrastructure/db/schemas/account";

export default class GetAccountsUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(ledgerId?: string): Promise<Account[]> {
    try {
      const accounts = await this.accountRepository.findAll({ ledgerId });
      return accounts;
    } catch (error) {
      throw new Error(`Failed to fetch accounts: ${error}`);
    }
  }
}
