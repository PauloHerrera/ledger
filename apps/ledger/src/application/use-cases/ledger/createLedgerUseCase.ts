import { type ILedgerRepository } from "../../../infrastructure/repositories/ledgerRepository";
import type {
  NewLedger,
  Ledger,
} from "../../../infrastructure/db/schemas/ledger";
import type { LedgerDTO } from "../../../presentation/validators/ledgerSchema";

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
