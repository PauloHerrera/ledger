import { Account, AccountsApiResponse } from './types';

const API_BASE_URL = 'http://localhost:5002';

export async function fetchAccounts(): Promise<Account[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/account`, {
      cache: 'no-store', // Disable caching for fresh data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: AccountsApiResponse = await response.json();
    
    // Handle different API response structures
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data.accounts && Array.isArray(data.accounts)) {
      return data.accounts;
    } else if (Array.isArray(data)) {
      return data as Account[];
    } else {
      return [];
    }
  } catch (err) {
    console.error("Failed to fetch accounts:", err);
    
    // Return mock data for development if API fails
    return [
      {
        id: "1",
        name: "Cash Account",
        type: "Asset",
        balance: 10000,
        status: "active",
        createdAt: "2024-01-01",
      },
      {
        id: "2", 
        name: "Accounts Receivable",
        type: "Asset",
        balance: 5000,
        status: "active",
        createdAt: "2024-01-02",
      },
      {
        id: "3",
        name: "Revenue Account",
        type: "Revenue",
        balance: 15000,
        status: "active", 
        createdAt: "2024-01-03",
      },
    ];
  }
}