import type { IAccountRepository } from "../../infrastructure/repositories/accountRepository";
import type { AccountDTO } from "../../presentation/validators/accountSchema";
import type {
  Account,
  NewAccount,
} from "../../infrastructure/db/schemas/account";

export default class CreateAccountUseCase {
  constructor(private accountRepo: IAccountRepository) {}

  async execute(data: AccountDTO): Promise<Account> {
    const account = await this.accountRepo.create(this.mapDTOToAccount(data));

    if (!account) {
      throw new Error("Failed to create ledger");
    }

    return account;
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
