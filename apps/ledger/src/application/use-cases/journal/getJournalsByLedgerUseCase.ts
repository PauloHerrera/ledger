import type { IJournalRepository } from "../../../infrastructure/repositories/journalRepository";
import type { IEntryRepository } from "../../../infrastructure/repositories/entryRepository";
import type { Journal } from "../../../infrastructure/db/schemas/journal";
import type { Entry } from "../../../infrastructure/db/schemas/entry";
import type { Account } from "../../../infrastructure/db/schemas/account";

export type JournalWithEntries = Journal & {
  entries: Array<Entry & { account: Account | null }>;
};

export default class GetJournalsByLedgerUseCase {
  constructor(
    private journalRepository: IJournalRepository,
    private entryRepository: IEntryRepository
  ) {}

  async execute(ledgerId: string): Promise<JournalWithEntries[]> {
    // 1. Find relevant journals for the ledger
    const journals = await this.journalRepository.findByLedgerId(ledgerId);

    // 2. For each journal fetch its entries (with account details)
    const results: JournalWithEntries[] = [];
    for (const j of journals) {
      const entries = await this.entryRepository.findByJournalIdWithAccount(j.id);
      results.push({ ...(j as Journal), entries });
    }

    return results;
  }
}