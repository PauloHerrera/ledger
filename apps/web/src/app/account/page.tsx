import { fetchAccounts } from "@/lib/api";
import Accounts from "@/components/accounts";
import { Button } from "@repo/ui/button";
import { Icons } from "@repo/ui/icons";
import { Suspense } from "react";

export default async function AccountPage() {
  const accounts = await fetchAccounts();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
        <div className="flex items-center space-x-2">
          <Button className="flex items-center gap-2">
            <Icons.Download className="h-4 w-4" />
            Export Data
          </Button>

          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button>
              <Icons.Download className="h-4 w-4" />
              Add Account
            </Button>
          </div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Accounts accounts={accounts} />
      </Suspense>
    </div>
  );
}
