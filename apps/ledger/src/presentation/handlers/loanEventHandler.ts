import type { Request, Response } from "express";
import { eventSchema } from "../validators/eventSchema";
import ProcessLoanEvent from "../../application/useCases/loanEvent/processLoanEvent";
import { TransactionRepository } from "../../infrastructure/repositories/transactionRepository";
import { EntryRepository } from "../../infrastructure/repositories/entryRepository";
import { JournalRepository } from "../../infrastructure/repositories/journalRepository";
import { db } from "../../infrastructure/db";
import {
  createSuccessResponse,
  createErrorResponse,
  formatZodErrors,
} from "@repo/utils/api";
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
      const response = createErrorResponse(
        "Invalid event data",
        validation.error.message,
        formatZodErrors(validation.error)
      );
      return res.status(400).json(response);
    }

    const processLoanEvent = new ProcessLoanEvent(
      transactionRepository,
      entryRepository,
      journalRepository
    );

    await processLoanEvent.execute(validation.data);

    const response = createSuccessResponse("Event processed successfully");

    res.status(200).json(response);
  } catch (error) {
    logger.error(`[Loan Event Processing] Error: ${error}`);
    const response = createErrorResponse(
      "Failed to process event",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};
