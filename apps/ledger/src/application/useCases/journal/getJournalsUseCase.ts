import type { IJournalRepository } from "../../../infrastructure/repositories/journalRepository";
import type {
  CompleteJournal,
  Journal,
} from "../../../infrastructure/db/schemas/journal";
import type { IEntryRepository } from "../../../infrastructure/repositories/entryRepository";
import type { JournalResponseDTO } from "../../types/journal";
import type { Entry } from "../../../infrastructure/db/schemas/entry";
import type { EntryResponseDTO } from "../../types/entry";
import type { Account } from "../../../infrastructure/db/schemas/account";
import { formatDate } from "date-fns";
import type { AccountType } from "../../types/account";

export default class GetJournalsUseCase {
  constructor(
    private journalRepository: IJournalRepository,
    private entryRepository: IEntryRepository
  ) {}

  async execute(ledgerId?: string): Promise<JournalResponseDTO[]> {
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

    return results.map((journal) => this.mapJournalToDTO(journal));
  }

  private mapJournalToDTO(journal: CompleteJournal): JournalResponseDTO {
    return {
      id: journal.id,
      name: journal.name,
      description: journal.description ?? "",
      ledgerId: journal.ledgerId ?? "",
      code: `J${journal.code.toString().padStart(4, "0")}`,
      journalEvent: journal.journalEvent,
      postingDate: formatDate(journal.postingDate, "yyyy-MM-dd HH:mm"),
      metadata: journal.metadata as Record<string, string>,
      entries: journal.entries.map((entry) => this.mapEntryToDTO(entry)),
    };
  }

  private mapEntryToDTO(
    entry: Entry & { account: Account | null }
  ): EntryResponseDTO {
    return {
      code: `E${entry.code.toString().padStart(4, "0")}`,
      amount: entry.amount ?? "0",
      direction: entry.direction,
      accountName: entry.account?.name ?? "",
      accountType: (entry.account?.accountType as AccountType) ?? "asset",
    };
  }
}
