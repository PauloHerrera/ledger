import type { IJournalRepository } from "../../../infrastructure/repositories/journalRepository";
import type { IEntryRepository } from "../../../infrastructure/repositories/entryRepository";
import type {
  Journal,
  CompleteJournal,
} from "../../../infrastructure/db/schemas/journal";

export default class GetJournalUseCase {
  constructor(
    private journalRepository: IJournalRepository,
    private entryRepository: IEntryRepository
  ) {}

  async execute(id: string): Promise<CompleteJournal> {
    // Fetch journal first
    const journal = await this.journalRepository.findById(id);

    if (!journal) {
      throw new Error("Journal not found");
    }

    // Fetch entries + accounts
    const entries = await this.entryRepository.findByJournalIdWithAccount(id);

    return {
      ...(journal as Journal),
      entries,
    };
  }
}
