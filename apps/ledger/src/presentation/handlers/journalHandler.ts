import type { Request, Response } from "express";
import {
  CreateJournalUseCase,
  GetJournalUseCase,
  GetJournalsUseCase,
} from "../../application/use-cases/journal";
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

export const getJournal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        message: "Journal ID is required",
      };
      return res.status(400).json(response);
    }

    const useCase = new GetJournalUseCase(journalRepo);
    const journal = await useCase.execute(id);

    const response: ApiResponse = {
      message: "Journal fetched successfully",
      data: journal,
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Journal not found") {
      const response: ApiResponse = {
        message: "Journal not found",
      };
      return res.status(404).json(response);
    }
    res.status(500).json({ message: `Failed to fetch journal: ${error}` });
  }
};

export const getJournals = async (req: Request, res: Response) => {
  try {
    const useCase = new GetJournalsUseCase(journalRepo);
    const journals = await useCase.execute();

    const response: ApiResponse = {
      message: "Journals fetched successfully",
      data: journals,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch journals: ${error}` });
  }
};
