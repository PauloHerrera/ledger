import type { Request, Response } from "express";
import { accountSchema } from "../validators/accountSchema";
import { AccountRepository } from "../../infrastructure/repositories/accountRepository";
import { db } from "../../infrastructure/db";
import CreateAccountUseCase from "../../application/use-cases/accountUseCase";
import type { ApiResponse } from "../types/api";

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
  const { id } = req.params;

  res.status(200).json({
    message: "Account fetched successfully",
  });
};

export const getAccounts = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Accounts fetched successfully",
  });
};
