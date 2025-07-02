import { Badge } from "@repo/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/card";
import { JournalEntry } from "@/lib/types";

type ItemCardProps = {
  entry: JournalEntry;
};

export default function ItemCard({ entry }: ItemCardProps) {
  return (
    <>
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
              <div className="text-center font-bold text-lg mb-4 pb-2 border-b-2  text-red-800 border-gray-300">
                DEBIT
              </div>
              <div className="space-y-3">
                {entry.entries
                  .filter((line) => line.debit > 0)
                  .map((line, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 rounded"
                    >
                      <span className="font-medium text-gray-800">
                        {line.account}
                      </span>
                      <span className="font-mono font-bold text-gray-600">
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
              <div className="text-center font-bold text-lg mb-4 pb-2 border-b-2  text-green-800 border-gray-300">
                CREDIT
              </div>
              <div className="space-y-3">
                {entry.entries
                  .filter((line) => line.credit > 0)
                  .map((line, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2  rounded"
                    >
                      <span className="font-medium ">{line.account}</span>
                      <span className="font-mono font-bold ">
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
              {entry.entries.reduce((sum, line) => sum + line.debit, 0) ===
              entry.entries.reduce((sum, line) => sum + line.credit, 0) ? (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  ✓ Balanced Entry
                </Badge>
              ) : (
                <Badge variant="destructive">⚠ Unbalanced Entry</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
