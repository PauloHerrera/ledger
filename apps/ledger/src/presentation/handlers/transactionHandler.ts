import type { Request, Response } from "express";
import { TransactionRepository } from "../../infrastructure/repositories/transactionRepository";
import { db } from "../../infrastructure/db";
import type { ApiResponse } from "../types/api";
import { transactionSchema } from "../validators/transactionSchema";
import CreateTransactionUseCase from "../../application/useCases/transaction/createTransactionUseCase";
import { TransactionEntryRepository } from "../../infrastructure/repositories/transactionEntryRepository";
import { AccountRepository } from "../../infrastructure/repositories/accountRepository";
import GetTransactionsUseCase from "../../application/useCases/transaction/getTransactionsUseCase";
import GetTransactionUseCase from "../../application/useCases/transaction/getTransactionUseCase";

const transactionRepository = new TransactionRepository(db);
const transactionEntryRepository = new TransactionEntryRepository(db);
const accountRepository = new AccountRepository(db);

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const validation = transactionSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        message: "Invalid transaction data",
        error: validation.error.message,
      };
      return res.status(400).json(response);
    }

    const createTransactionUseCase = new CreateTransactionUseCase(
      transactionRepository,
      transactionEntryRepository,
      accountRepository
    );

    const transaction = await createTransactionUseCase.execute(validation.data);

    const response: ApiResponse = {
      message: "Transaction created successfully",
      data: transaction,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: `Failed to create transaction: ${error}` });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        message: "Transaction ID is required",
      };

      return res.status(400).json(response);
    }

    const useCase = new GetTransactionUseCase(transactionRepository);
    const transaction = await useCase.execute(id as string);

    const response: ApiResponse = {
      message: "Transaction fetched successfully",
      data: transaction,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: `Failed to get transaction: ${error}` });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { event } = req.query;

    const useCase = new GetTransactionsUseCase(transactionRepository);
    const transactions = await useCase.execute(event as string);

    const response: ApiResponse = {
      message: "Transactions fetched successfully",
      data: transactions,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: `Failed to get transactions: ${error}` });
  }
};
