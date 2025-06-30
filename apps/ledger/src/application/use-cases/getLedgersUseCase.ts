import { type ILedgerRepository } from "../../infrastructure/repositories/ledgerRepository";
import type { Ledger } from "../../infrastructure/db/schemas/ledger";

export default class GetLedgersUseCase {
  constructor(private ledgerRepository: ILedgerRepository) {}

  async execute(): Promise<Ledger[]> {
    try {
      const ledgers = await this.ledgerRepository.findAll();
      return ledgers;
    } catch (error) {
      throw new Error(`Failed to fetch ledgers: ${error}`);
    }
  }
}