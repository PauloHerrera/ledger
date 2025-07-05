import type { Request, Response } from "express";
import { accountSchema } from "../validators/accountSchema";
import { AccountRepository } from "../../infrastructure/repositories/accountRepository";
import { db } from "../../infrastructure/db";

import type { ApiResponse } from "../types/api";
import {
  CreateAccountUseCase,
  GetAccountUseCase,
  GetAccountsUseCase,
} from "../../application/useCases/account";

const accountRepo = new AccountRepository(db);

export const createAccount = async (req: Request, res: Response) => {
  try {
    const validation = accountSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        message: "Invalid account data",
        error: validation.error.message,
      };

      return res.status(400).json(response);
    }

    const accountData = validation.data;
    const useCase = new CreateAccountUseCase(accountRepo);
    const account = await useCase.execute(accountData);

    const response: ApiResponse = {
      message: "Account created successfully",
      data: account,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: `Failed to create account: ${error}` });
  }
};

export const getAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        message: "Account ID is required",
      };
      return res.status(400).json(response);
    }

    const useCase = new GetAccountUseCase(accountRepo);
    const account = await useCase.execute(id);

    const response: ApiResponse = {
      message: "Account fetched successfully",
      data: account,
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Account not found") {
      const response: ApiResponse = {
        message: "Account not found",
      };
      return res.status(404).json(response);
    }
    res.status(500).json({ message: `Failed to fetch account: ${error}` });
  }
};

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const useCase = new GetAccountsUseCase(accountRepo);
    const accounts = await useCase.execute();

    const response: ApiResponse = {
      message: "Accounts fetched successfully",
      data: accounts,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch accounts: ${error}` });
  }
};
