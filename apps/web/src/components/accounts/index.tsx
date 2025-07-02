"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@repo/ui/table";
import { Input } from "@repo/ui/input";
import { Account } from "@/lib/types";
import { Download, Printer, Search, ArrowUpDown } from "lucide-react";

type AccountsProps = {
  accounts: Account[];
};

export default function Accounts({ accounts }: AccountsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Account | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const requestSort = (key: keyof Account) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedAccounts = useMemo(() => {
    let filteredAccounts = [...accounts];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filteredAccounts = filteredAccounts.filter(
        (a) =>
          a.name.toLowerCase().includes(lower) ||
          a.accountType.toLowerCase().includes(lower)
      );
    }
    if (sortConfig.key) {
      filteredAccounts.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Account];
        const bValue = b[sortConfig.key as keyof Account];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filteredAccounts;
  }, [accounts, searchTerm, sortConfig]);

  const getSortIndicator = (key: keyof Account) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpDown className="ml-1 h-4 w-4 text-primary" />
    ) : (
      <ArrowUpDown className="ml-1 h-4 w-4 text-primary rotate-180" />
    );
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm p-4 rounded-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">
            Current Accounts
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      Name
                      {getSortIndicator("name")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => requestSort("accountType")}
                  >
                    <div className="flex items-center">
                      Type
                      {getSortIndicator("accountType")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => requestSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Created At
                      {getSortIndicator("createdAt")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No accounts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedAccounts.map((account) => (
                    <TableRow
                      key={account.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {account.name}
                      </TableCell>
                      <TableCell>{account.accountType}</TableCell>
                      <TableCell>
                        {new Date(account.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter className="bg-muted/50">
                <TableRow>
                  <TableCell colSpan={3} className="text-right">
                    Total Accounts: {filteredAndSortedAccounts.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4 px-4 pb-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedAccounts.length} of {accounts.length}{" "}
            accounts
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
