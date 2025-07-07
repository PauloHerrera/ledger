import type { Request, Response } from "express";
import { LedgerRepository } from "../../infrastructure/repositories/ledgerRepository";
import CreateLedgerUseCase, {
  GetLedgerUseCase,
  GetLedgersUseCase,
} from "../../application/useCases/ledger";
import { ledgerSchema } from "../validators/ledgerSchema";
import { db } from "../../infrastructure/db";
import {
  createSuccessResponse,
  createErrorResponse,
  formatZodErrors,
  parsePaginationParams,
  createPaginationInfo,
} from "@repo/utils/api";
import logger from "@repo/logger";
import { validateUUID } from "../../lib/validation";

const ledgerRepo = new LedgerRepository(db);

export const createLedger = async (req: Request, res: Response) => {
  try {
    const validation = ledgerSchema.safeParse(req.body);

    if (!validation.success) {
      logger.error(`Invalid ledger data: ${validation.error.message}`);
      const response = createErrorResponse(
        "Invalid ledger data",
        validation.error.message,
        formatZodErrors(validation.error)
      );

      return res.status(400).json(response);
    }
    const ledgerData = validation.data;
    const useCase = new CreateLedgerUseCase(ledgerRepo);
    const ledger = await useCase.execute(ledgerData);

    const response = createSuccessResponse(
      "Ledger created successfully",
      ledger
    );

    res.status(201).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to create ledger",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const getLedger = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response = createErrorResponse("Ledger ID is required");
      return res.status(400).json(response);
    }

    // Validate UUID format
    const uuidValidation = validateUUID(id);
    if (!uuidValidation.isValid) {
      const response = createErrorResponse(
        "Invalid ledger ID format",
        uuidValidation.error
      );
      return res.status(400).json(response);
    }

    const useCase = new GetLedgerUseCase(ledgerRepo);
    const ledger = await useCase.execute(id);

    const response = createSuccessResponse(
      "Ledger fetched successfully",
      ledger
    );

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Ledger not found") {
      const response = createErrorResponse("Ledger not found");
      return res.status(404).json(response);
    }
    const response = createErrorResponse(
      "Failed to fetch ledger",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const getLedgers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = parsePaginationParams(req.query);
    const offset = (page - 1) * limit;

    const useCase = new GetLedgersUseCase(ledgerRepo);
    const ledgers = await useCase.execute();

    // Apply pagination to the results
    const paginatedLedgers = ledgers.slice(offset, offset + limit);
    const total = ledgers.length;

    const pagination = createPaginationInfo(page, limit, total);

    const response = createSuccessResponse(
      "Ledgers fetched successfully",
      paginatedLedgers,
      pagination
    );

    res.status(200).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to fetch ledgers",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};
