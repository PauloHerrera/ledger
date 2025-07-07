import { Badge } from "@repo/ui/badge";

interface BalanceVerificationProps {
  isBalanced: boolean;
}

export default function BalanceVerification({
  isBalanced,
}: BalanceVerificationProps) {
  return (
    <div className="border-t-2 border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-center">
        {isBalanced ? (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            ✓ Balanced Entry
          </Badge>
        ) : (
          <Badge variant="destructive">⚠ Unbalanced Entry</Badge>
        )}
      </div>
    </div>
  );
}
