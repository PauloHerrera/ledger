import type { Request, Response } from "express";
import { eventSchema } from "../validators/eventSchema";
import ProcessLoanEvent from "../../application/useCases/loanEvent/processLoanEvent";
import { TransactionRepository } from "../../infrastructure/repositories/transactionRepository";
import { EntryRepository } from "../../infrastructure/repositories/entryRepository";
import { JournalRepository } from "../../infrastructure/repositories/journalRepository";
import { db } from "../../infrastructure/db";

const transactionRepository = new TransactionRepository(db);
const entryRepository = new EntryRepository(db);
const journalRepository = new JournalRepository(db);

export const createLoanEvent = async (req: Request, res: Response) => {
  try {
    const { event } = req.body;
    const eventDTO = eventSchema.parse(event);

    const processLoanEvent = new ProcessLoanEvent(
      transactionRepository,
      entryRepository,
      journalRepository
    );

    await processLoanEvent.execute(eventDTO);

    res.status(200).json({ message: "Event processed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
