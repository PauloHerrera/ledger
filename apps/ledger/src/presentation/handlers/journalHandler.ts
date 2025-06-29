import type { Request, Response } from "express";
import CreateJournalUseCase from "../../application/use-cases/journalUseCase";
import { db } from "../../infrastructure/db";
import { JournalRepository } from "../../infrastructure/repositories/journalRepository";
import { EntryRepository } from "../../infrastructure/repositories/entryRepository";
import { journalSchema } from "../validators/journalSchema";
import type { ApiResponse } from "../types/api";

const journalRepo = new JournalRepository(db);
const entryRepo = new EntryRepository(db);

export const createJournal = async (req: Request, res: Response) => {
  try {
    const validation = journalSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        message: "Invalid journal data",
        error: validation.error.message,
      };

      return res.status(400).json(response);
    }

    const createJournalUseCase = new CreateJournalUseCase(
      journalRepo,
      entryRepo
    );

    const journal = await createJournalUseCase.execute(validation.data);

    const response: ApiResponse = {
      message: "Journal created successfully",
      data: journal,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: `Failed to create journal: ${error}` });
  }
};
