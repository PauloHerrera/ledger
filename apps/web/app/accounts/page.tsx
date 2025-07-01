"use client";

import { useState, useEffect } from "react";
import { Card } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@repo/ui/table";
import Link from "next/link";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  status: "active" | "inactive";
  createdAt: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true);
        // Assuming ledger runs on port 3000 - you may need to adjust this
        const response = await fetch("http://localhost:3000/api/accounts");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle the API response structure based on your backend
        if (data.data && Array.isArray(data.data)) {
          setAccounts(data.data);
        } else if (Array.isArray(data)) {
          setAccounts(data);
        } else {
          // If no accounts yet, set empty array
          setAccounts([]);
        }
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch accounts");
        
        // For development, show mock data if API fails
        setAccounts([
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
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading accounts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Button>Create Account</Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-orange-800">
                API Connection Issue
              </p>
              <p className="text-sm text-orange-600">
                {error}. Showing mock data for development.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">All Accounts</h3>
            <Badge variant="secondary">{accounts.length} accounts</Badge>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <p>No accounts found</p>
                      <p className="text-sm">Create your first account to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.type}</TableCell>
                    <TableCell>{formatCurrency(account.balance)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={account.status === "active" ? "default" : "secondary"}
                      >
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(account.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}