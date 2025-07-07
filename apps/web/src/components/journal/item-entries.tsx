import type { Entry } from "@/lib/types";

interface ItemEntriesProps {
  entries: Entry[];
  totalDebits: number;
  totalCredits: number;
}

export default function ItemEntries({
  entries,
  totalDebits,
  totalCredits,
}: ItemEntriesProps) {
  return (
    <>
      {/* Debit Side (Left) */}
      <div className="border-r-2 border-gray-300 dark:border-gray-600 p-4">
        <div className="text-center font-bold text-lg mb-4 pb-2 border-b-2  text-red-800 border-gray-300 dark:border-gray-600">
          DEBIT
        </div>
        <div className="space-y-3">
          {entries
            ?.filter((line) => line.direction === "debit")
            .map((line, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 rounded"
              >
                <span className="font-medium text-gray-800">
                  {line.accountName}
                </span>
                <span className="font-mono font-bold text-gray-600">
                  ${line.amount}
                </span>
              </div>
            ))}
        </div>
        <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between font-bold text-red-600">
            <span>Total Debits:</span>
            <span className="font-mono">${totalDebits.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Credit Side (Right) */}
      <div className="p-4">
        <div className="text-center font-bold text-lg mb-4 pb-2 border-b-2  text-green-800 border-gray-300 dark:border-gray-600">
          CREDIT
        </div>
        <div className="space-y-3">
          {entries
            ?.filter((line) => line.direction === "credit")
            .map((line, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2  rounded"
              >
                <span className="font-medium ">{line.accountName}</span>
                <span className="font-mono font-bold ">${line.amount}</span>
              </div>
            ))}
        </div>
        <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between font-bold text-green-600">
            <span>Total Credits:</span>
            <span className="font-mono">${totalCredits.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
