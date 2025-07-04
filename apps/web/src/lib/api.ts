"use server";

import {
  Account,
  AccountsApiResponse,
  Ledger,
  Journal,
  ApiResponse,
  CreateJournalRequest,
  AccountBalance,
} from "./types";
import { env } from "@/lib/env";

export async function fetchAccounts(): Promise<Account[]> {
  try {
    const response = await fetch(`${env.ledgerAPI}/api/account`, {
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
      ledgerId: account.ledgerId,
    }));

    return responseData || [];
  } catch (err) {
    console.error("Failed to fetch accounts:", err);
    return [];
  }
}

export async function fetchLedgers(): Promise<Ledger[]> {
  try {
    const response = await fetch(`${env.ledgerAPI}/api/ledger`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Ledger[]> = await response.json();
    return data.data || [];
  } catch (err) {
    console.error("Failed to fetch ledgers:", err);
    return [];
  }
}

export async function fetchAccountBalances(
  ledgerId?: string
): Promise<AccountBalance[]> {
  try {
    const filter = ledgerId ? `?ledgerId=${ledgerId}` : "";
    const response = await fetch(
      `${env.ledgerAPI}/api/account-balance${filter}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<AccountBalance[]> = await response.json();
    return data.data || [];
  } catch (err) {
    console.error("Failed to fetch ledgers:", err);
    return [];
  }
}

export async function fetchJournals(): Promise<Journal[]> {
  try {
    const response = await fetch(`${env.ledgerAPI}/api/journal`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Journal[]> = await response.json();
    return data.data || [];
  } catch (err) {
    console.error("Failed to fetch journals:", err);
    return [];
  }
}

export async function createJournal(
  journalData: CreateJournalRequest
): Promise<Journal | null> {
  try {
    const response = await fetch(`${env.ledgerAPI}/api/journal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(journalData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Journal> = await response.json();
    return data.data || null;
  } catch (err) {
    console.error("Failed to create journal:", err);
    return null;
  }
}
