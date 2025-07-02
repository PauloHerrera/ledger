"use server";

import { Account, AccountsApiResponse } from "./types";
import { env } from "@/lib/env";

export async function fetchAccounts(): Promise<Account[]> {
  try {
    const response = await fetch(`${env.ledgerAPI}/account`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AccountsApiResponse = await response.json();

    const responseData = data.data?.map((account) => ({
      id: account.id,
      name: account.name,
      accountType: account.accountType,
      balance: 1234,
      status: "active",
      createdAt: account.createdAt,
    }));

    return responseData || [];
  } catch (err) {
    console.error("Failed to fetch accounts:", err);
    return [];
  }
}
