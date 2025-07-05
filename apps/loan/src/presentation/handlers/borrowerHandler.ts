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
import {
  createSuccessResponse,
  createErrorResponse,
  formatZodErrors,
  parsePaginationParams,
  createPaginationInfo,
} from "../types/api";

const borrowerRepo = new BorrowerRepository(db);

export const createBorrower = async (req: Request, res: Response) => {
  try {
    const validation = borrowerSchema.safeParse(req.body);

    if (!validation.success) {
      const response = createErrorResponse(
        "Invalid borrower data",
        validation.error.message,
        formatZodErrors(validation.error)
      );

      return res.status(400).json(response);
    }

    const borrowerData = validation.data;
    const useCase = new CreateBorrowerUseCase(borrowerRepo);
    const borrower = await useCase.execute(borrowerData);

    const response = createSuccessResponse("Borrower created successfully", borrower);

    res.status(201).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to create borrower",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const getBorrower = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response = createErrorResponse("Borrower ID is required");
      return res.status(400).json(response);
    }

    const useCase = new GetBorrowerUseCase(borrowerRepo);
    const borrower = await useCase.execute(id);

    const response = createSuccessResponse("Borrower fetched successfully", borrower);

    res.status(200).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to fetch borrower",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(404).json(response);
  }
};

export const getBorrowers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = parsePaginationParams(req.query);
    const offset = (page - 1) * limit;

    const useCase = new GetBorrowersUseCase(borrowerRepo);
    const borrowers = await useCase.execute();

    // Apply pagination to the results
    const paginatedBorrowers = borrowers.slice(offset, offset + limit);
    const total = borrowers.length;

    const pagination = createPaginationInfo(page, limit, total);

    const response = createSuccessResponse(
      "Borrowers fetched successfully",
      paginatedBorrowers,
      pagination
    );

    res.status(200).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to fetch borrowers",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};