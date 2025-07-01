import type { IAccountRepository } from "../../../infrastructure/repositories/accountRepository";
import type { Account } from "../../../infrastructure/db/schemas/account";

export default class GetAccountUseCase {
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
