import type { LedgerDTO } from "../../presentation/validators/ledgerSchema";
import type { ILedgerRepository } from "../../infrastructure/repositories/ledgerRepository";
import type { NewLedger, Ledger } from "../../infrastructure/db/schemas/ledger";

export default class CreateLedgerUseCase {
  constructor(private ledgerRepository: ILedgerRepository) {}

  async execute(data: LedgerDTO): Promise<Ledger> {
    try {
      const ledgerData = this.mapDTOToLedger(data);
      const ledger = await this.ledgerRepository.create(ledgerData);
      return ledger;
    } catch (error) {
      throw new Error(`Failed to create ledger: ${error}`);
    }
  }

  private mapDTOToLedger(data: LedgerDTO): NewLedger {
    return {
      name: data.name,
      description: data.description,
      metadata: data.metadata,
    };
  }
}

export class GetLedgerUseCase {
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

export class GetLedgersUseCase {
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
