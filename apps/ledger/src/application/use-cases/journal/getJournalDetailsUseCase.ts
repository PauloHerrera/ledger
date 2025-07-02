import type { IJournalRepository } from "../../../infrastructure/repositories/journalRepository";
import type { IEntryRepository } from "../../../infrastructure/repositories/entryRepository";
import type { Journal } from "../../../infrastructure/db/schemas/journal";
import type { Entry } from "../../../infrastructure/db/schemas/entry";
import type { Account } from "../../../infrastructure/db/schemas/account";

export type JournalDetails = Journal & {
  entries: Array<Entry & { account: Account | null }>;
};

export default class GetJournalDetailsUseCase {
  constructor(
    private journalRepository: IJournalRepository,
    private entryRepository: IEntryRepository
  ) {}

  async execute(id: string): Promise<JournalDetails> {
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