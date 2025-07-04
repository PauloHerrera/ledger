import type { IEntryRepository } from "../../../infrastructure/repositories/entryRepository";
import type { AccountBalance } from "../../types/account";

export interface GetAccountBalancesFilters {
  startDate?: Date;
  endDate?: Date;
  ledgerId?: string;
}

export default class GetAccountBalancesUseCase {
  constructor(private entryRepository: IEntryRepository) {}

  async execute(
    filters?: GetAccountBalancesFilters
  ): Promise<AccountBalance[]> {
    try {
      const accountBalances =
        await this.entryRepository.getAccountBalances(filters);
      return accountBalances;
    } catch (error) {
      throw new Error(`Failed to fetch account balances: ${error}`);
    }
  }
}
