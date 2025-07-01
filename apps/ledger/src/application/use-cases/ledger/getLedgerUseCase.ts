import { type ILedgerRepository } from "../../../infrastructure/repositories/ledgerRepository";
import type { Ledger } from "../../../infrastructure/db/schemas/ledger";

export default class GetLedgerUseCase {
  constructor(private ledgerRepository: ILedgerRepository) {}

  async execute(id: string): Promise<Ledger> {
    try {
      const ledger = await this.ledgerRepository.findById(id);
      if (!ledger) {
        throw new Error("Ledger not found");
      }
      return ledger;
    } catch (error) {
      if (error instanceof Error && error.message === "Ledger not found") {
        throw error;
      }
      throw new Error(`Failed to fetch ledger: ${error}`);
    }
  }
}
