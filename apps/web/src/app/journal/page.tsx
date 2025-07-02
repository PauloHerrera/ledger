import { fetchJournals, fetchAccounts, fetchLedgers } from "@/lib/api";
import Journal from "@/components/journal";

export default async function JournalPage() {
  const [journals, accounts, ledgers] = await Promise.all([
    fetchJournals(),
    fetchAccounts(),
    fetchLedgers(),
  ]);

  return (
    <>
      <Journal journals={journals} accounts={accounts} ledgers={ledgers} />
    </>
  );
}
