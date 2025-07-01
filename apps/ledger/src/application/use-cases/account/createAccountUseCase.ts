import type { AccountDTO } from "../../../presentation/validators/accountSchema";
import type { IAccountRepository } from "../../../infrastructure/repositories/accountRepository";
import type {
  NewAccount,
  Account,
} from "../../../infrastructure/db/schemas/account";

export default class CreateAccountUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(data: AccountDTO): Promise<Account> {
    try {
      const account = await this.accountRepository.create(
        this.mapDTOToAccount(data)
      );
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
