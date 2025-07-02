"use server";

import { Account, AccountsApiResponse, Ledger, Journal, ApiResponse, CreateJournalRequest } from "./types";
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

export async function fetchJournalsByLedgerId(ledgerId: string): Promise<Journal[]> {
  try {
    // Since the API doesn't support filtering by ledgerId directly,
    // we'll fetch all journals and filter on the client side based on account relationships
    const [journals, accounts] = await Promise.all([
      fetchJournals(),
      fetchAccounts()
    ]);

    // Get account IDs for this ledger
    const ledgerAccountIds = accounts
      .filter(account => account.ledgerId === ledgerId)
      .map(account => account.id);

    // Filter journals that have entries for these accounts
    // Note: This is a simplified approach since we don't have entry data here
    // In a real implementation, you might need additional API calls
    return journals; // For now, return all journals
  } catch (err) {
    console.error("Failed to fetch journals by ledger ID:", err);
    return [];
  }
}

export async function createJournal(journalData: CreateJournalRequest): Promise<Journal | null> {
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
