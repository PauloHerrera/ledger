import type { Request, Response } from "express";
import { LedgerRepository } from "../../infrastructure/repositories/ledgerRepository";
import CreateLedgerUseCase from "../../application/use-cases/ledgerUseCase";
import { ledgerSchema } from "../validators/ledgerSchema";
import { db } from "../../infrastructure/db";
import type { ApiResponse } from "../types/api";
const ledgerRepo = new LedgerRepository(db);

export const createLedger = async (req: Request, res: Response) => {
  try {
    const validation = ledgerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: "Invalid ledger data" });
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
  const { id } = req.params;

  res.status(200).json({
    message: "Ledger fetched successfully",
  });
};

export const getLedgers = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Ledgers fetched successfully",
  });
};
