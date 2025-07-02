import type { IJournalRepository } from "../../../infrastructure/repositories/journalRepository";
import type {
  CompleteJournal,
  Journal,
} from "../../../infrastructure/db/schemas/journal";
import type { IEntryRepository } from "../../../infrastructure/repositories/entryRepository";

export default class GetJournalsUseCase {
  constructor(
    private journalRepository: IJournalRepository,
    private entryRepository: IEntryRepository
  ) {}

  async execute(ledgerId?: string): Promise<CompleteJournal[]> {
    // 1. Find relevant journals - either all or by ledger
    const journals = ledgerId
      ? await this.journalRepository.findByLedgerId(ledgerId)
      : await this.journalRepository.findAll();

    // 2. For each journal fetch its entries (with account details)
    const results: CompleteJournal[] = [];
    for (const j of journals) {
      const entries = await this.entryRepository.findByJournalIdWithAccount(
        j.id
      );
      results.push({ ...(j as Journal), entries });
    }

    return results;
  }
}
