import type { IJournalRepository } from "../../infrastructure/repositories/journalRepository";
import type { Journal } from "../../infrastructure/db/schemas/journal";

export default class GetJournalsUseCase {
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