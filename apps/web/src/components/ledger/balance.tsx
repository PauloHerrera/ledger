"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@repo/ui/table";
import { Button } from "@repo/ui/button";
import { Select } from "@repo/ui/select";
import { Icons } from "@repo/ui/icons";
import { Ledger, Account } from "@/lib/types";
import { fetchAccounts } from "@/lib/api";

interface BalanceProps {
  ledgers: Ledger[];
}

export default function Balance({ ledgers }: BalanceProps) {
  const [selectedLedger, setSelectedLedger] = useState<Ledger | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ledgers.length > 0 && !selectedLedger && ledgers[0]) {
      setSelectedLedger(ledgers[0]);
    }
  }, [ledgers, selectedLedger]);

  useEffect(() => {
    if (selectedLedger) {
      loadAccountsForLedger(selectedLedger.id);
    }
  }, [selectedLedger]);

  const loadAccountsForLedger = async (ledgerId: string) => {
    setLoading(true);
    try {
      const allAccounts = await fetchAccounts();
      const ledgerAccounts = allAccounts.filter(
        (account) => account.ledgerId === ledgerId
      );
      setAccounts(ledgerAccounts);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let totalDebits = 0;
    let totalCredits = 0;

    accounts.forEach((account) => {
      if (account.accountType === "asset" || account.accountType === "expense") {
        if (account.balance > 0) {
          totalDebits += account.balance;
        }
      } else if (
        account.accountType === "liability" ||
        account.accountType === "equity" ||
        account.accountType === "revenue"
      ) {
        if (account.balance > 0) {
          totalCredits += account.balance;
        }
      }
    });

    return { totalDebits, totalCredits };
  };

  const { totalDebits, totalCredits } = calculateTotals();
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedLedger ? selectedLedger.name : "Ledger"} Balance Sheet
          </h1>
          <p className="text-gray-600">Double Entry Bookkeeping System</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="flex items-center gap-2">
            <Icons.Download className="h-4 w-4" />
            Export Balance Sheet
          </Button>
        </div>
      </div>

      {/* Ledger Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Ledger</CardTitle>
          <CardDescription>Choose a ledger to view its trial balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ledgers.map((ledger) => (
              <Card
                key={ledger.id}
                className={`cursor-pointer transition-all ${
                  selectedLedger?.id === ledger.id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedLedger(ledger)}
              >
                <CardContent className="p-4">
                  <div className="font-medium">{ledger.name}</div>
                  {ledger.description && (
                    <div className="text-sm text-gray-600 mt-1">
                      {ledger.description}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Created: {new Date(ledger.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trial Balance */}
      {selectedLedger && (
        <Card>
          <CardHeader>
            <CardTitle>Trial Balance - {selectedLedger.name}</CardTitle>
            <CardDescription>Verify that debits equal credits</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading accounts...</div>
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No accounts found for this ledger
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          {account.name}
                        </TableCell>
                        <TableCell className="capitalize">
                          {account.accountType}
                        </TableCell>
                        <TableCell className="text-right">
                          {(account.accountType === "asset" ||
                            account.accountType === "expense") &&
                          account.balance > 0
                            ? `$${account.balance.toLocaleString()}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {(account.accountType === "liability" ||
                            account.accountType === "equity" ||
                            account.accountType === "revenue") &&
                          account.balance > 0
                            ? `$${account.balance.toLocaleString()}`
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 font-bold">
                      <TableCell colSpan={2}>TOTALS</TableCell>
                      <TableCell className="text-right">
                        ${totalDebits.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ${totalCredits.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    isBalanced ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`font-medium ${
                      isBalanced ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {isBalanced ? "✓" : "⚠"} Trial Balance{" "}
                    {isBalanced ? "is in balance" : "is NOT in balance"}
                  </p>
                  <p
                    className={`text-sm ${
                      isBalanced ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isBalanced
                      ? "Total debits equal total credits"
                      : "Total debits do not equal total credits"}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
