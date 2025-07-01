import type { Request, Response } from "express";
import { LedgerRepository } from "../../infrastructure/repositories/ledgerRepository";
import CreateLedgerUseCase, {
  GetLedgerUseCase,
  GetLedgersUseCase,
} from "../../application/use-cases/ledger";
import { ledgerSchema } from "../validators/ledgerSchema";
import { db } from "../../infrastructure/db";
import type { ApiResponse } from "../types/api";
import logger from "@repo/logger";

const ledgerRepo = new LedgerRepository(db);

export const createLedger = async (req: Request, res: Response) => {
  try {
    const validation = ledgerSchema.safeParse(req.body);

    if (!validation.success) {
      logger.error(`Invalid ledger data: ${validation.error.message}`);
      const response: ApiResponse = {
        message: "Invalid ledger data",
        error: validation.error.message,
      };

      return res.status(400).json(response);
    }
    const ledgerData = validation.data;
    const useCase = new CreateLedgerUseCase(ledgerRepo);
    const ledger = await useCase.execute(ledgerData);

    const response: ApiResponse = {
      message: "Ledger created successfully",
      data: ledger,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: `Failed to create ledger: ${error}` });
  }
};

export const getLedger = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        message: "Ledger ID is required",
      };
      return res.status(400).json(response);
    }

    const useCase = new GetLedgerUseCase(ledgerRepo);
    const ledger = await useCase.execute(id);

    const response: ApiResponse = {
      message: "Ledger fetched successfully",
      data: ledger,
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Ledger not found") {
      const response: ApiResponse = {
        message: "Ledger not found",
      };
      return res.status(404).json(response);
    }
    res.status(500).json({ message: `Failed to fetch ledger: ${error}` });
  }
};

export const getLedgers = async (req: Request, res: Response) => {
  try {
    const useCase = new GetLedgersUseCase(ledgerRepo);
    const ledgers = await useCase.execute();

    const response: ApiResponse = {
      message: "Ledgers fetched successfully",
      data: ledgers,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch ledgers: ${error}` });
  }
};
