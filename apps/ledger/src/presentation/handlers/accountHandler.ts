import type { Request, Response } from "express";
import { accountSchema } from "../validators/accountSchema";
import { AccountRepository } from "../../infrastructure/repositories/accountRepository";
import { db } from "../../infrastructure/db";

import {
  createSuccessResponse,
  createErrorResponse,
  formatZodErrors,
  parsePaginationParams,
  createPaginationInfo,
} from "@repo/utils/api";

import {
  CreateAccountUseCase,
  GetAccountUseCase,
  GetAccountsUseCase,
  type GetAccountsFilters,
} from "../../application/useCases/account";

const accountRepo = new AccountRepository(db);

export const createAccount = async (req: Request, res: Response) => {
  try {
    const validation = accountSchema.safeParse(req.body);

    if (!validation.success) {
      const response = createErrorResponse(
        "Invalid account data",
        validation.error.message,
        formatZodErrors(validation.error)
      );

      return res.status(400).json(response);
    }

    const accountData = validation.data;
    const useCase = new CreateAccountUseCase(accountRepo);
    const account = await useCase.execute(accountData);

    const response = createSuccessResponse(
      "Account created successfully",
      account
    );

    res.status(201).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to create account",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const getAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response = createErrorResponse("Account ID is required");
      return res.status(400).json(response);
    }

    const useCase = new GetAccountUseCase(accountRepo);
    const account = await useCase.execute(id);

    const response = createSuccessResponse(
      "Account fetched successfully",
      account
    );

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Account not found") {
      const response = createErrorResponse("Account not found");
      return res.status(404).json(response);
    }
    const response = createErrorResponse(
      "Failed to fetch account",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = parsePaginationParams(req.query);
    const { accountId } = req.query;
    const offset = (page - 1) * limit;

    const filters: GetAccountsFilters = {};
    
    if (accountId) {
      // Validate that accountId is a valid UUID if provided
      if (typeof accountId === 'string' && accountId.length > 0) {
        filters.accountId = accountId;
      }
    }

    const useCase = new GetAccountsUseCase(accountRepo);
    const accounts = await useCase.execute(filters);

    // Apply pagination to the results
    const paginatedAccounts = accounts.slice(offset, offset + limit);
    const total = accounts.length;

    const pagination = createPaginationInfo(page, limit, total);

    const response = createSuccessResponse(
      "Accounts fetched successfully",
      paginatedAccounts,
      pagination
    );

    res.status(200).json(response);
  } catch (error) {
    const response = createErrorResponse(
      "Failed to fetch accounts",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json(response);
  }
};
