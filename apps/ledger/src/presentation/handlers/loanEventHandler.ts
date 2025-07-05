import type { Request, Response } from "express";
import { eventSchema } from "../validators/eventSchema";
import ProcessLoanEvent from "../../application/useCases/loanEvent/processLoanEvent";
import { TransactionRepository } from "../../infrastructure/repositories/transactionRepository";
import { EntryRepository } from "../../infrastructure/repositories/entryRepository";
import { JournalRepository } from "../../infrastructure/repositories/journalRepository";
import { db } from "../../infrastructure/db";
import type { ApiResponse } from "../types/api";
import logger from "@repo/logger";

const transactionRepository = new TransactionRepository(db);
const entryRepository = new EntryRepository(db);
const journalRepository = new JournalRepository(db);

export const createLoanEvent = async (req: Request, res: Response) => {
  try {
    const { event } = req.body;

    logger.info(`[Loan Event Processing] ${JSON.stringify(event)}`);
    const validation = eventSchema.safeParse(event);

    if (!validation.success) {
      const response: ApiResponse = {
        message: "Invalid transaction data",
        error: validation.error.message,
      };
      return res.status(400).json(response);
    }

    const processLoanEvent = new ProcessLoanEvent(
      transactionRepository,
      entryRepository,
      journalRepository
    );

    await processLoanEvent.execute(validation.data);

    res.status(200).json({ message: "Event processed successfully" });
  } catch (error) {
    logger.error(`[Loan Event Processing] Error: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
