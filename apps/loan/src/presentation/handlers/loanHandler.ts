import type { Request, Response } from "express";
import { loanSchema, updateLoanStatusSchema } from "../validators/loanSchema";
import { LoanRepository } from "../../infrastructure/repositories/loanRepository";
import { BorrowerRepository } from "../../infrastructure/repositories/borrowerRepository";
import { db } from "../../infrastructure/db";
import {
  CreateLoanUseCase,
  GetLoanUseCase,
  GetLoansUseCase,
  UpdateLoanUseCase,
} from "../../application/use-cases/loan";
import {
  createSuccessResponse,
  createErrorResponse,
  formatZodErrors,
  parsePaginationParams,
  createPaginationInfo,
} from "@repo/utils/api";

const loanRepo = new LoanRepository(db);
const borrowerRepo = new BorrowerRepository(db);

export const createLoan = async (req: Request, res: Response) => {
  try {
    const validation = loanSchema.safeParse(req.body);

    if (!validation.success) {
      const response = createErrorResponse(
        "Invalid loan data",
        validation.error.message,
        formatZodErrors(validation.error)
      );

      return res.status(400).json(response);
    }

    const loanData = validation.data;
    const useCase = new CreateLoanUseCase(loanRepo, borrowerRepo);
    const loan = await useCase.execute(loanData);

    const response = createSuccessResponse("Loan created successfully", loan);

    res.status(201).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to create loan",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const getLoan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response = createErrorResponse("Loan ID is required");
      return res.status(400).json(response);
    }

    const useCase = new GetLoanUseCase(loanRepo);
    const loan = await useCase.execute(id);

    const response = createSuccessResponse("Loan fetched successfully", loan);

    res.status(200).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to fetch loan",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(404).json(response);
  }
};

export const getLoans = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = parsePaginationParams(req.query);
    const offset = (page - 1) * limit;

    const useCase = new GetLoansUseCase(loanRepo);
    const loans = await useCase.execute();

    // Apply pagination to the results
    const paginatedLoans = loans.slice(offset, offset + limit);
    const total = loans.length;

    const pagination = createPaginationInfo(page, limit, total);

    const response = createSuccessResponse(
      "Loans fetched successfully",
      paginatedLoans,
      pagination
    );

    res.status(200).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to fetch loans",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const updateLoanStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response = createErrorResponse("Loan ID is required");
      return res.status(400).json(response);
    }

    const validation = updateLoanStatusSchema.safeParse(req.body);

    if (!validation.success) {
      const response = createErrorResponse(
        "Invalid status data",
        validation.error.message,
        formatZodErrors(validation.error)
      );

      return res.status(400).json(response);
    }

    const statusData = validation.data;
    const useCase = new UpdateLoanUseCase(loanRepo);
    const loan = await useCase.execute(id, statusData);

    const response = createSuccessResponse(
      "Loan status updated successfully",
      loan
    );

    res.status(200).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to update loan status",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};
