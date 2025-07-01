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
import type { ApiResponse } from "../types/api";

const loanRepo = new LoanRepository(db);
const borrowerRepo = new BorrowerRepository(db);

export const createLoan = async (req: Request, res: Response) => {
  try {
    const validation = loanSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        message: "Invalid loan data",
        error: validation.error.message,
      };

      return res.status(400).json(response);
    }

    const loanData = validation.data;
    const useCase = new CreateLoanUseCase(loanRepo, borrowerRepo);
    const loan = await useCase.execute(loanData);

    const response: ApiResponse = {
      message: "Loan created successfully",
      data: loan,
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      message: "Failed to create loan",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

export const getLoan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        message: "Loan ID is required",
      };
      return res.status(400).json(response);
    }

    const useCase = new GetLoanUseCase(loanRepo);
    const loan = await useCase.execute(id);

    const response: ApiResponse = {
      message: "Loan fetched successfully",
      data: loan,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      message: "Failed to fetch loan",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(404).json(response);
  }
};

export const getLoans = async (req: Request, res: Response) => {
  try {
    const useCase = new GetLoansUseCase(loanRepo);
    const loans = await useCase.execute();

    const response: ApiResponse = {
      message: "Loans fetched successfully",
      data: loans,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      message: "Failed to fetch loans",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};

export const updateLoanStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        message: "Loan ID is required",
      };
      return res.status(400).json(response);
    }

    const validation = updateLoanStatusSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        message: "Invalid status data",
        error: validation.error.message,
      };

      return res.status(400).json(response);
    }

    const statusData = validation.data;
    const useCase = new UpdateLoanUseCase(loanRepo);
    const loan = await useCase.execute(id, statusData);

    const response: ApiResponse = {
      message: "Loan status updated successfully",
      data: loan,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      message: "Failed to update loan status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
    res.status(500).json(response);
  }
};
