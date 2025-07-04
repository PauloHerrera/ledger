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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Icons } from "@repo/ui/icons";
import { Ledger, AccountBalance } from "@/lib/types";
import { fetchAccountBalances } from "@/lib/api";

interface BalanceProps {
  ledgers: Ledger[];
}

type Balance = {
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
};

export default function Balance({ ledgers }: BalanceProps) {
  const [selectedLedger, setSelectedLedger] = useState<Ledger | null>(null);
  const [accounts, setAccounts] = useState<AccountBalance[]>([]);
  const [balanceResult, setBalanceResult] = useState<Balance>({
    totalDebits: 0,
    totalCredits: 0,
    isBalanced: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ledgers.length > 0 && !selectedLedger && ledgers[0]) {
      setSelectedLedger(ledgers[0]);
    }
  }, [ledgers, selectedLedger]);

  useEffect(() => {
    if (!selectedLedger) return;

    const loadAccounts = async (ledgerId: string) => {
      setLoading(true);
      try {
        const accountBalances = await fetchAccountBalances(ledgerId);

        setAccounts(accountBalances);
        calculateBalance(accountBalances);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts(selectedLedger.id);
  }, [selectedLedger]);

  const calculateBalance = (accounts: AccountBalance[]) => {
    const totalDebits = accounts.reduce(
      (acc, account) => acc + Number(account.totalAmountDebits),
      0
    );
    const totalCredits = accounts.reduce(
      (acc, account) => acc + Number(account.totalAmountCredits),
      0
    );

    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    setBalanceResult({ totalDebits, totalCredits, isBalanced });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Ledger Balance Sheet
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
          <CardDescription>
            Choose a ledger to view its trial balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Select
              value={selectedLedger?.id || ""}
              onValueChange={(value) => {
                const ledger = ledgers.find((l) => l.id === value);
                if (ledger) {
                  setSelectedLedger(ledger);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a ledger" />
              </SelectTrigger>
              <SelectContent>
                {ledgers.map((ledger) => (
                  <SelectItem key={ledger.id} value={ledger.id}>
                    <div className="font-medium">{ledger.name}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trial Balance */}
      {selectedLedger && (
        <Card>
          <CardHeader>
            <CardTitle>Trial Balance - {selectedLedger.name}</CardTitle>
            <CardDescription>{selectedLedger.description}</CardDescription>
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
                      <TableRow key={account.accountId}>
                        <TableCell className="font-medium">
                          {account.accountName}
                        </TableCell>
                        <TableCell className="capitalize">
                          {account.accountType}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(account.totalAmountDebits) > 0
                            ? `$${Number(account.totalAmountDebits).toFixed(2)}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(account.totalAmountCredits) > 0
                            ? `$${Number(account.totalAmountCredits).toFixed(2)}`
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 font-bold">
                      <TableCell colSpan={2}>TOTALS</TableCell>
                      <TableCell className="text-right">
                        ${balanceResult.totalDebits.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${balanceResult.totalCredits.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    balanceResult.isBalanced ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`font-medium ${
                      balanceResult.isBalanced
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {balanceResult.isBalanced ? "✓" : "⚠"} Trial Balance{" "}
                    {balanceResult.isBalanced
                      ? "is in balance"
                      : "is NOT in balance"}
                  </p>
                  <p
                    className={`text-sm ${
                      balanceResult.isBalanced
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {balanceResult.isBalanced
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
