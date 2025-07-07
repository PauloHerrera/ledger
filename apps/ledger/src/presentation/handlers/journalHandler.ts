import type { Request, Response } from "express";
import {
  CreateJournalUseCase,
  GetJournalsUseCase,
  GetJournalUseCase,
} from "../../application/useCases/journal";
import { db } from "../../infrastructure/db";
import { JournalRepository } from "../../infrastructure/repositories/journalRepository";
import { EntryRepository } from "../../infrastructure/repositories/entryRepository";
import { journalSchema } from "../validators/journalSchema";
import {
  createSuccessResponse,
  createErrorResponse,
  formatZodErrors,
  parsePaginationParams,
  createPaginationInfo,
} from "@repo/utils/api";
import { validateUUID } from "../../lib/validation";

const journalRepo = new JournalRepository(db);
const entryRepo = new EntryRepository(db);

export const createJournal = async (req: Request, res: Response) => {
  try {
    const validation = journalSchema.safeParse(req.body);

    if (!validation.success) {
      const response = createErrorResponse(
        "Invalid journal data",
        validation.error.message,
        formatZodErrors(validation.error)
      );

      return res.status(400).json(response);
    }

    const createJournalUseCase = new CreateJournalUseCase(
      journalRepo,
      entryRepo
    );

    const journal = await createJournalUseCase.execute(validation.data);

    const response = createSuccessResponse(
      "Journal created successfully",
      journal
    );

    res.status(201).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to create journal",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const getJournal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response = createErrorResponse("Journal ID is required");
      return res.status(400).json(response);
    }

    // Validate UUID format
    const uuidValidation = validateUUID(id);
    if (!uuidValidation.isValid) {
      const response = createErrorResponse(
        "Invalid journal ID format",
        uuidValidation.error
      );
      return res.status(400).json(response);
    }

    const useCase = new GetJournalUseCase(journalRepo, entryRepo);
    const journal = await useCase.execute(id);

    const response = createSuccessResponse(
      "Journal fetched successfully",
      journal
    );

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Journal not found") {
      const response = createErrorResponse("Journal not found");
      return res.status(404).json(response);
    }
    const response = createErrorResponse(
      "Failed to fetch journal",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const getJournals = async (req: Request, res: Response) => {
  try {
    const ledgerId = req.query.ledgerId as string | undefined;
    const { page = 1, limit = 10 } = parsePaginationParams(req.query);
    const offset = (page - 1) * limit;

    // Validate ledgerId UUID format if provided
    if (ledgerId) {
      const uuidValidation = validateUUID(ledgerId);
      if (!uuidValidation.isValid) {
        const response = createErrorResponse(
          "Invalid ledger ID format",
          uuidValidation.error
        );
        return res.status(400).json(response);
      }
    }

    const useCase = new GetJournalsUseCase(journalRepo, entryRepo);
    const journals = await useCase.execute(ledgerId);

    // Apply pagination to the results
    const paginatedJournals = journals.slice(offset, offset + limit);
    const total = journals.length;

    const pagination = createPaginationInfo(page, limit, total);

    const response = createSuccessResponse(
      journals.length > 0
        ? "Journals fetched successfully"
        : "No journals found",
      paginatedJournals,
      pagination
    );

    res.status(200).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to fetch journals",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};
