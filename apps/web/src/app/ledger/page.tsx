import { fetchLedgers } from "@/lib/api";
import Balance from "@/components/ledger/balance";

export default async function LedgerPage() {
  const ledgers = await fetchLedgers();

  return (
    <>
      <Balance ledgers={ledgers} />
    </>
  );
}
