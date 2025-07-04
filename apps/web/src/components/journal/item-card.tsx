import { Badge } from "@repo/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/card";
import type { Journal } from "@/lib/types";
import BalanceVerification from "./balance-verification";
import ItemEntries from "./item-entries";

type ItemCardProps = {
  journal: Journal;
};

export default function ItemCard({ journal }: ItemCardProps) {
  const { totalDebits, totalCredits } = journal.entries?.reduce(
    (acc, entry) => {
      const amount = Number(entry.amount);
      if (entry.direction === "debit") {
        acc.totalDebits += amount;
      } else if (entry.direction === "credit") {
        acc.totalCredits += amount;
      }
      return acc;
    },
    { totalDebits: 0, totalCredits: 0 }
  ) ?? { totalDebits: 0, totalCredits: 0 };

  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <>
      <Card key={journal.id} className="border-2 border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {journal.name} - {journal.description || "No description"}
              </CardTitle>
              <CardDescription>
                {journal.postingDate} | Event: {journal.journalEvent}
              </CardDescription>
            </div>
            <Badge variant="outline">#{journal.code}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 min-h-[200px]">
            <ItemEntries
              entries={journal.entries ?? []}
              totalDebits={totalDebits}
              totalCredits={totalCredits}
            />
          </div>

          <BalanceVerification isBalanced={isBalanced} />
        </CardContent>
      </Card>
    </>
  );
}
