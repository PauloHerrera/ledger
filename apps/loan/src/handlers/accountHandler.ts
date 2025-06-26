import type { Request, Response } from "express";

export const createAccount = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  res.status(201).json({
    message: "Account created successfully",
  });
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
