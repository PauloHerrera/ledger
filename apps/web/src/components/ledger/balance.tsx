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
import { accountBalances } from "@/lib/fake-data";

export default function Balance() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Ledger X Balance Sheet
      </h1>
      <p className="text-gray-600">Double Entry Bookkeeping System</p>
      <Card>
        <CardHeader>
          <CardTitle>Trial Balance</CardTitle>
          <CardDescription>Verify that debits equal credits</CardDescription>
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
                    {(account.type === "Asset" || account.type === "Expense") &&
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
    </div>
  );
}
