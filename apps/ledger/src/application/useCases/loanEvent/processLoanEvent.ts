import logger from "@repo/logger";
import { type NewEntry } from "../../../infrastructure/db/schemas/entry";
import { mapDTOToJournal } from "../../../infrastructure/db/schemas/journal";
import type { IEntryRepository } from "../../../infrastructure/repositories/entryRepository";
import type { IJournalRepository } from "../../../infrastructure/repositories/journalRepository";
import type { ITransactionRepository } from "../../../infrastructure/repositories/transactionRepository";
import type { EventDTO } from "../../../presentation/validators/eventSchema";

export default class ProcessLoanEvent {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly entryRepository: IEntryRepository,
    private readonly journalRepository: IJournalRepository
  ) {}

  async execute(eventData: EventDTO): Promise<void> {
    // Find transaction for the event
    const transaction = await this.transactionRepository.findByEventType(
      eventData.event
    );

    logger.info(
      `[Loan Event Processing] Transactions Available: ${JSON.stringify(transaction)}`
    );

    if (!transaction) {
      throw new Error("Transaction not found for the event");
    }

    // Create journal
    const journalDTO = {
      ...eventData,
      transactionId: eventData.transactionId,
      name: eventData.event,
      postingDate: eventData.timestamp,
      metadata: eventData.data,
      entries: [],
      description: transaction.description || eventData.event,
      ledgerId: transaction.ledgerId || "",
      amount: 0, // TODO: get amount from data or remove this field
    };

    const journalData = mapDTOToJournal(journalDTO);
    const journal = await this.journalRepository.create(journalData);

    const entriesData = [];
    for (const transactionEntry of transaction.entries) {
      // Create entries
      const entry = {
        accountId: transactionEntry.accountId,
        journalId: journal.id,
        description: transaction.description || eventData.event,
        amount: this.getAmount(transactionEntry.amountField, eventData.data),
        direction: transactionEntry.direction,
      } as NewEntry;

      entriesData.push(entry);
    }

    logger.info(
      `[Loan Event Processing] Entries to be created: ${JSON.stringify(entriesData)}`
    );

    await this.entryRepository.createBatch(entriesData);

    logger.info(
      `[Loan Event Processing] Created Journal: ${journal.id} Entries: ${JSON.stringify(
        entriesData.map((entry) => entry.id)
      )}`
    );
  }

  private getAmount(amountField: string, data: Record<string, string>): string {
    const amount = data[amountField];

    if (!amount) {
      throw new Error(`Amount not found on data field ${amountField}`);
    }

    return amount || "0";
  }
}
