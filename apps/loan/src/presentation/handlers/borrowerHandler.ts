import type { Request, Response } from "express";
import { borrowerSchema } from "../validators/borrowerSchema";
import { BorrowerRepository } from "../../infrastructure/repositories/borrowerRepository";
import { db } from "../../infrastructure/db";
import {
  CreateBorrowerUseCase,
  GetBorrowerUseCase,
  GetBorrowersUseCase,
} from "../../application/use-cases/borrowerUseCase";
import type { ApiResponse } from "../types/api";

const borrowerRepo = new BorrowerRepository(db);

export const createBorrower = async (req: Request, res: Response) => {
  try {
    const validation = borrowerSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        message: "Invalid borrower data",
        error: validation.error.message,
      };

      return res.status(400).json(response);
    }

    const borrowerData = validation.data;
    const useCase = new CreateBorrowerUseCase(borrowerRepo);
    const borrower = await useCase.execute(borrowerData);

    const response: ApiResponse = {
      message: "Borrower created successfully",
      data: borrower,
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      message: "Failed to create borrower",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

export const getBorrower = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const useCase = new GetBorrowerUseCase(borrowerRepo);
    const borrower = await useCase.execute(id);

    const response: ApiResponse = {
      message: "Borrower fetched successfully",
      data: borrower,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      message: "Failed to fetch borrower",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(404).json(response);
  }
};

export const getBorrowers = async (req: Request, res: Response) => {
  try {
    const useCase = new GetBorrowersUseCase(borrowerRepo);
    const borrowers = await useCase.execute();

    const response: ApiResponse = {
      message: "Borrowers fetched successfully",
      data: borrowers,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      message: "Failed to fetch borrowers",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};