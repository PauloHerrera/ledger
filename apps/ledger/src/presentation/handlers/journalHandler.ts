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
    const { startDate, endDate, ledgerId } = req.query;
    const { page = 1, limit = 10 } = parsePaginationParams(req.query);
    const offset = (page - 1) * limit;

    const filters: {
      startDate?: Date;
      endDate?: Date;
      ledgerId?: string;
    } = {};

    if (startDate) {
      const parsedStartDate = new Date(startDate as string);
      if (isNaN(parsedStartDate.getTime())) {
        const response = createErrorResponse(
          "Invalid startDate format. Use ISO date format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)"
        );
        return res.status(400).json(response);
      }
      filters.startDate = parsedStartDate;
    }

    if (endDate) {
      const parsedEndDate = new Date(endDate as string);
      if (isNaN(parsedEndDate.getTime())) {
        const response = createErrorResponse(
          "Invalid endDate format. Use ISO date format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)"
        );
        return res.status(400).json(response);
      }
      filters.endDate = parsedEndDate;
    }

    if (ledgerId) {
      filters.ledgerId = ledgerId as string;
    }

    const useCase = new GetJournalsUseCase(journalRepo, entryRepo);
    const journals = await useCase.execute(filters);

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
