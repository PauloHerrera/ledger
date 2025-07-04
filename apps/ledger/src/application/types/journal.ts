import type { EntryResponseDTO } from "./entry";

export interface JournalResponseDTO {
  id: string;
  ledgerId: string;
  name: string;
  code: string;
  description: string;
  journalEvent: string;
  postingDate: string;
  metadata: Record<string, string>;
  entries: EntryResponseDTO[];
}
