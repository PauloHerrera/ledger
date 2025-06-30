import type { IJournalRepository } from "../../infrastructure/repositories/journalRepository";
import type { IEntryRepository } from "../../infrastructure/repositories/entryRepository";
import type { NewJournal, Journal } from "../../infrastructure/db/schemas/journal";
import type { NewEntry } from "../../infrastructure/db/schemas/entry";
import type { EntryDTO } from "../../presentation/validators/entrySchema";
import type { JournalDTO } from "../../presentation/validators/journalSchema";

export default class CreateJournalUseCase {
  constructor(
    private journalRepo: IJournalRepository,
    private entryRepo: IEntryRepository
  ) {}

  async execute(data: JournalDTO) {
    try {
      // Validate entries amount. The sum of debit and credit must be equal to the amount
      const totalDebit = data.entries.reduce((acc, entry) => {
        return acc + (entry.direction === "debit" ? entry.amount : 0);
      }, 0);
      const totalCredit = data.entries.reduce((acc, entry) => {
        return acc + (entry.direction === "credit" ? entry.amount : 0);
      }, 0);

      if (totalDebit !== totalCredit || totalDebit !== data.amount) {
        throw new Error("Invalid entries amount");
      }

      // Create journal
      const journalData = this.mapDTOToJournal(data);
      const journal = await this.journalRepo.create(journalData);

      // Create entries
      const dataEntries = this.mapDTOToEntries(data.entries, journal.id);

      await this.entryRepo.createBatch(dataEntries);

      return journal;
    } catch (error) {
      throw new Error("Error creating journal");
    }
  }

  private mapDTOToJournal(data: JournalDTO): NewJournal {
    return {
      name: data.name || data.event,
      journalEvent: data.event,
      description: data.description,
      postingDate: new Date(data.postingDate),
      metadata: data.metadata,
    };
  }

  private mapDTOToEntries(data: EntryDTO[], journalId: string): NewEntry[] {
    return data.map((entry) => ({
      ...entry,
      journalId,
      amount: entry.amount.toString(),
    }));
  }
}

export class GetJournalUseCase {
  constructor(private journalRepository: IJournalRepository) {}

  async execute(id: string): Promise<Journal> {
    try {
      const journal = await this.journalRepository.findById(id);
      if (!journal) {
        throw new Error("Journal not found");
      }
      return journal;
    } catch (error) {
      if (error instanceof Error && error.message === "Journal not found") {
        throw error;
      }
      throw new Error(`Failed to fetch journal: ${error}`);
    }
  }
}

export class GetJournalsUseCase {
  constructor(private journalRepository: IJournalRepository) {}

  async execute(): Promise<Journal[]> {
    try {
      const journals = await this.journalRepository.findAll();
      return journals;
    } catch (error) {
      throw new Error(`Failed to fetch journals: ${error}`);
    }
  }
}
