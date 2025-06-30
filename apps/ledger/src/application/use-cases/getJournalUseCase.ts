import type { IJournalRepository } from "../../infrastructure/repositories/journalRepository";
import type { Journal } from "../../infrastructure/db/schemas/journal";

export default class GetJournalUseCase {
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