import type { Request, Response } from "express";
import { GetAccountBalancesUseCase } from "../../application/use-cases/account";
import { EntryRepository } from "../../infrastructure/repositories/entryRepository";
import type { ApiResponse } from "../types/api";
import { db } from "../../infrastructure/db";

const entryRepo = new EntryRepository(db);

export const getAccountBalances = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, ledgerId } = req.query;

    const filters: {
      startDate?: Date;
      endDate?: Date;
      ledgerId?: string;
    } = {};

    if (startDate) {
      const parsedStartDate = new Date(startDate as string);
      if (isNaN(parsedStartDate.getTime())) {
        const response: ApiResponse = {
          message:
            "Invalid startDate format. Use ISO date format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)",
        };
        return res.status(400).json(response);
      }
      filters.startDate = parsedStartDate;
    }

    if (endDate) {
      const parsedEndDate = new Date(endDate as string);
      if (isNaN(parsedEndDate.getTime())) {
        const response: ApiResponse = {
          message:
            "Invalid endDate format. Use ISO date format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)",
        };
        return res.status(400).json(response);
      }
      filters.endDate = parsedEndDate;
    }

    if (ledgerId) {
      filters.ledgerId = ledgerId as string;
    }

    const useCase = new GetAccountBalancesUseCase(entryRepo);
    const accountBalances = await useCase.execute(filters);

    const response: ApiResponse = {
      message:
        accountBalances.length > 0
          ? "Account balances fetched successfully"
          : "No account balances found",
      data: accountBalances,
      total: accountBalances.length,
    };

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to fetch account balances: ${error}` });
  }
};
