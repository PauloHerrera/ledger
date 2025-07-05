import type { Request, Response } from "express";
import { TransactionRepository } from "../../infrastructure/repositories/transactionRepository";
import { db } from "../../infrastructure/db";
import type { ApiResponse } from "../types/api";
import {
  createSuccessResponse,
  createErrorResponse,
  formatZodErrors,
  parsePaginationParams,
  createPaginationInfo,
} from "../types/api";
import { transactionSchema } from "../validators/transactionSchema";
import CreateTransactionUseCase from "../../application/useCases/transaction/createTransactionUseCase";
import { TransactionEntryRepository } from "../../infrastructure/repositories/transactionEntryRepository";
import GetTransactionsUseCase from "../../application/useCases/transaction/getTransactionsUseCase";
import GetTransactionUseCase from "../../application/useCases/transaction/getTransactionUseCase";

const transactionRepository = new TransactionRepository(db);
const transactionEntryRepository = new TransactionEntryRepository(db);

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const validation = transactionSchema.safeParse(req.body);

    if (!validation.success) {
      const response = createErrorResponse(
        "Invalid transaction data",
        validation.error.message,
        formatZodErrors(validation.error)
      );
      return res.status(400).json(response);
    }

    const createTransactionUseCase = new CreateTransactionUseCase(
      transactionRepository,
      transactionEntryRepository
    );

    const transaction = await createTransactionUseCase.execute(validation.data);

    const response = createSuccessResponse("Transaction created successfully", transaction);

    res.status(201).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to create transaction",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response = createErrorResponse("Transaction ID is required");
      return res.status(400).json(response);
    }

    const useCase = new GetTransactionUseCase(transactionRepository);
    const transaction = await useCase.execute(id as string);

    const response = createSuccessResponse("Transaction fetched successfully", transaction);

    res.status(200).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to get transaction",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { event } = req.query;

    const useCase = new GetTransactionsUseCase(transactionRepository);
    const transaction = await useCase.execute(event as string);

    // Since the use case returns a single transaction, we'll wrap it in an array for consistency
    const transactions = transaction ? [transaction] : [];

    const response = createSuccessResponse(
      transactions.length > 0 
        ? "Transactions fetched successfully" 
        : "No transactions found",
      transactions
    );

    res.status(200).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to get transactions",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};
