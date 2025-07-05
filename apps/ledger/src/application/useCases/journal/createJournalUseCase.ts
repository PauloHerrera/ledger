import type { IJournalRepository } from "../../../infrastructure/repositories/journalRepository";
import type { IEntryRepository } from "../../../infrastructure/repositories/entryRepository";
import { mapDTOToJournal } from "../../../infrastructure/db/schemas/journal";
import { mapDTOToEntries } from "../../../infrastructure/db/schemas/entry";
import type { EntryDTO } from "../../../presentation/validators/entrySchema";
import type { JournalDTO } from "../../../presentation/validators/journalSchema";

export default class CreateJournalUseCase {
  constructor(
    private journalRepo: IJournalRepository,
    private entryRepo: IEntryRepository
  ) {}

  async execute(data: JournalDTO) {
    try {
      if (data.entries.length === 0) {
        throw new Error("No entries provided");
      }

      if (!data.transactionId) {
        throw new Error("Transaction id is required");
      }

      // Validate if the transaction id is already in the database
      const existingJournal = await this.journalRepo.findById(
        data.transactionId
      );
      if (existingJournal) {
        throw new Error("Transaction id already exists");
      }

      // Validate entries amount. The sum of debit and credit must be equal to the amount
      const totalDebit = data.entries.reduce((acc: number, entry: EntryDTO) => {
        return acc + (entry.direction === "debit" ? entry.amount : 0);
      }, 0);
      const totalCredit = data.entries.reduce(
        (acc: number, entry: EntryDTO) => {
          return acc + (entry.direction === "credit" ? entry.amount : 0);
        },
        0
      );

      if (totalDebit !== totalCredit || totalDebit !== data.amount) {
        throw new Error("Invalid entries amount");
      }

      // Create journal
      const journalData = mapDTOToJournal(data);
      const journal = await this.journalRepo.create(journalData);

      // Create entries
      const dataEntries = mapDTOToEntries(data.entries, journal.id);

      await this.entryRepo.createBatch(dataEntries);

      return journal;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error creating journal"
      );
    }
  }
}
