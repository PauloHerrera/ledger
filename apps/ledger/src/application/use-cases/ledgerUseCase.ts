import type { LedgerDTO } from "../../presentation/validators/ledgerSchema";
import type { ILedgerRepository } from "../../infrastructure/repositories/ledgerRepository";
import type { NewLedger } from "../../infrastructure/db/schemas/ledger";
import type { Ledger } from "../../infrastructure/db/schemas/ledger";

export default class CreateLedgerUseCase {
  constructor(private ledgerRepo: ILedgerRepository) {}

  async execute(data: LedgerDTO): Promise<Ledger> {
    const ledger = await this.ledgerRepo.create(this.mapDTOToLedger(data));

    if (!ledger) {
      throw new Error("Failed to create ledger");
    }

    return ledger;
  }

  private mapDTOToLedger(data: LedgerDTO): NewLedger {
    return {
      name: data.name,
      description: data.description,
    };
  }
}
