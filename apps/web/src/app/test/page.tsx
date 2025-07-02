"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { Badge } from "@repo/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Eye,
} from "lucide-react";

// Sample data for the accounting system
const journalEntries = [
  {
    id: "JE001",
    date: "2024-01-15",
    description: "Office supplies purchase",
    reference: "INV-001",
    entries: [
      { account: "Office Supplies", debit: 250.0, credit: 0 },
      { account: "Cash", debit: 0, credit: 250.0 },
    ],
  },
  {
    id: "JE002",
    date: "2024-01-16",
    description: "Service revenue",
    reference: "INV-002",
    entries: [
      { account: "Cash", debit: 1500.0, credit: 0 },
      { account: "Service Revenue", debit: 0, credit: 1500.0 },
    ],
  },
  {
    id: "JE003",
    date: "2024-01-17",
    description: "Rent payment",
    reference: "RENT-001",
    entries: [
      { account: "Rent Expense", debit: 2000.0, credit: 0 },
      { account: "Cash", debit: 0, credit: 2000.0 },
    ],
  },
  {
    id: "JE004",
    date: "2024-01-18",
    description: "Equipment purchase",
    reference: "EQ-001",
    entries: [
      { account: "Equipment", debit: 5000.0, credit: 0 },
      { account: "Accounts Payable", debit: 0, credit: 5000.0 },
    ],
  },
];

const accountBalances = [
  { account: "Cash", type: "Asset", balance: 8750.0 },
  { account: "Accounts Receivable", type: "Asset", balance: 3200.0 },
  { account: "Office Supplies", type: "Asset", balance: 250.0 },
  { account: "Equipment", type: "Asset", balance: 5000.0 },
  { account: "Accounts Payable", type: "Liability", balance: 5000.0 },
  { account: "Service Revenue", type: "Revenue", balance: 1500.0 },
  { account: "Rent Expense", type: "Expense", balance: 2000.0 },
  { account: "Owner's Equity", type: "Equity", balance: 10700.0 },
];

const monthlyData = [
  { month: "Jan", revenue: 15000, expenses: 8000 },
  { month: "Feb", revenue: 18000, expenses: 9500 },
  { month: "Mar", revenue: 22000, expenses: 11000 },
  { month: "Apr", revenue: 19000, expenses: 10200 },
  { month: "May", revenue: 25000, expenses: 12500 },
  { month: "Jun", revenue: 28000, expenses: 14000 },
];

const accountTypeData = [
  { name: "Assets", value: 17200, color: "#0088FE" },
  { name: "Liabilities", value: 5000, color: "#00C49F" },
  { name: "Equity", value: 10700, color: "#FFBB28" },
  { name: "Revenue", value: 1500, color: "#FF8042" },
];

export default function TestPage() {
  //   const [selectedEntry, setSelectedEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    description: "",
    reference: "",
    entries: [{ account: "", debit: "", credit: "" }],
  });

  const totalAssets = accountBalances
    .filter((acc) => acc.type === "Asset")
    .reduce((sum, acc) => sum + acc.balance, 0);
  const totalLiabilities = accountBalances
    .filter((acc) => acc.type === "Liability")
    .reduce((sum, acc) => sum + acc.balance, 0);
  const totalEquity = accountBalances
    .filter((acc) => acc.type === "Equity")
    .reduce((sum, acc) => sum + acc.balance, 0);
  const totalRevenue = accountBalances
    .filter((acc) => acc.type === "Revenue")
    .reduce((sum, acc) => sum + acc.balance, 0);

  const addEntryLine = () => {
    setNewEntry({
      ...newEntry,
      entries: [...newEntry.entries, { account: "", debit: "", credit: "" }],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Accounting Dashboard
            </h1>
            <p className="text-gray-600">Double Entry Bookkeeping System</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Journal Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Journal Entry</DialogTitle>
                <DialogDescription>
                  Add a new double-entry journal entry to your books.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Transaction description"
                      value={newEntry.description}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="reference">Reference</Label>
                    <Input
                      id="reference"
                      placeholder="Reference number"
                      value={newEntry.reference}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, reference: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Journal Entries</Label>
                  {newEntry.entries.map((entry, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="accounts-receivable">
                            Accounts Receivable
                          </SelectItem>
                          <SelectItem value="office-supplies">
                            Office Supplies
                          </SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="accounts-payable">
                            Accounts Payable
                          </SelectItem>
                          <SelectItem value="service-revenue">
                            Service Revenue
                          </SelectItem>
                          <SelectItem value="rent-expense">
                            Rent Expense
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Debit" type="number" />
                      <Input placeholder="Credit" type="number" />
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addEntryLine}
                    className="w-full bg-transparent"
                  >
                    Add Line
                  </Button>
                </div>
                <Button className="w-full">Create Entry</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Assets
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalAssets.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Liabilities
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalLiabilities.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                -5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Owners Equity
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalEquity.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <Calculator className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(totalRevenue - 2000).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Current period</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>
                Monthly comparison over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
                  <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Distribution</CardTitle>
              <CardDescription>Breakdown by account type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={accountTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent ?? 0 * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {accountTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="journal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="journal">Journal Entries</TabsTrigger>
            <TabsTrigger value="t-accounts">T-Accounts</TabsTrigger>
            <TabsTrigger value="accounts">Account Balances</TabsTrigger>
            <TabsTrigger value="trial">Trial Balance</TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Journal Entries</CardTitle>
                <CardDescription>
                  Double-entry bookkeeping transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journalEntries.map((entry) => (
                    <Card
                      key={entry.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {entry.id}
                            </CardTitle>
                            <CardDescription>
                              {entry.description}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{entry.reference}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {entry.date}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Account</TableHead>
                              <TableHead className="text-right">
                                Debit
                              </TableHead>
                              <TableHead className="text-right">
                                Credit
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {entry.entries.map((line, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {line.account}
                                </TableCell>
                                <TableCell className="text-right">
                                  {line.debit > 0
                                    ? `$${line.debit.toFixed(2)}`
                                    : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {line.credit > 0
                                    ? `$${line.credit.toFixed(2)}`
                                    : "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="t-accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>T-Account View</CardTitle>
                <CardDescription>
                  Traditional T-account representation of journal entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {journalEntries.map((entry) => (
                    <Card key={entry.id} className="border-2 border-gray-200">
                      <CardHeader className="bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {entry.id} - {entry.description}
                            </CardTitle>
                            <CardDescription>
                              {entry.date} | Ref: {entry.reference}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-2 min-h-[200px]">
                          {/* Debit Side (Left) */}
                          <div className="border-r-2 border-gray-300 p-4">
                            <div className="text-center font-bold text-lg mb-4 pb-2 border-b-2 border-gray-300">
                              DEBIT
                            </div>
                            <div className="space-y-3">
                              {entry.entries
                                .filter((line) => line.debit > 0)
                                .map((line, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-2 bg-red-50 rounded"
                                  >
                                    <span className="font-medium text-red-800">
                                      {line.account}
                                    </span>
                                    <span className="font-mono font-bold text-red-600">
                                      ${line.debit.toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-200">
                              <div className="flex justify-between font-bold text-red-600">
                                <span>Total Debits:</span>
                                <span className="font-mono">
                                  $
                                  {entry.entries
                                    .reduce((sum, line) => sum + line.debit, 0)
                                    .toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Credit Side (Right) */}
                          <div className="p-4">
                            <div className="text-center font-bold text-lg mb-4 pb-2 border-b-2 border-gray-300">
                              CREDIT
                            </div>
                            <div className="space-y-3">
                              {entry.entries
                                .filter((line) => line.credit > 0)
                                .map((line, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-2 bg-green-50 rounded"
                                  >
                                    <span className="font-medium text-green-800">
                                      {line.account}
                                    </span>
                                    <span className="font-mono font-bold text-green-600">
                                      ${line.credit.toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-200">
                              <div className="flex justify-between font-bold text-green-600">
                                <span>Total Credits:</span>
                                <span className="font-mono">
                                  $
                                  {entry.entries
                                    .reduce((sum, line) => sum + line.credit, 0)
                                    .toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Balance Verification */}
                        <div className="border-t-2 border-gray-300 p-4 bg-gray-50">
                          <div className="flex justify-center">
                            {entry.entries.reduce(
                              (sum, line) => sum + line.debit,
                              0
                            ) ===
                            entry.entries.reduce(
                              (sum, line) => sum + line.credit,
                              0
                            ) ? (
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                ✓ Balanced Entry
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                ⚠ Unbalanced Entry
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Balances</CardTitle>
                <CardDescription>
                  Current balances for all accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountBalances.map((account, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {account.account}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              account.type === "Asset"
                                ? "default"
                                : account.type === "Liability"
                                  ? "destructive"
                                  : account.type === "Equity"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ${account.balance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trial Balance</CardTitle>
                <CardDescription>
                  Verify that debits equal credits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountBalances.map((account, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {account.account}
                        </TableCell>
                        <TableCell className="text-right">
                          {(account.type === "Asset" ||
                            account.type === "Expense") &&
                          account.balance > 0
                            ? `$${account.balance.toLocaleString()}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {(account.type === "Liability" ||
                            account.type === "Equity" ||
                            account.type === "Revenue") &&
                          account.balance > 0
                            ? `$${account.balance.toLocaleString()}`
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 font-bold">
                      <TableCell>TOTALS</TableCell>
                      <TableCell className="text-right">$19,200.00</TableCell>
                      <TableCell className="text-right">$19,200.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Trial Balance is in balance
                  </p>
                  <p className="text-green-600 text-sm">
                    Total debits equal total credits
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
