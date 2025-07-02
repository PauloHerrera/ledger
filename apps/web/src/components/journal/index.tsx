"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Icons } from "@repo/ui/icons";
import { Journal as JournalType, Account, Ledger } from "@/lib/types";
import ItemCard from "./item-card";
import AddJournal from "./add-journal";

interface JournalProps {
  journals: JournalType[];
  accounts: Account[];
  ledgers: Ledger[];
}

export default function Journal({ journals, accounts, ledgers }: JournalProps) {
  const [journalList, setJournalList] = useState<JournalType[]>(journals);
  const [selectedLedger, setSelectedLedger] = useState<string>("all");

  const filteredJournals = selectedLedger === "all" 
    ? journalList 
    : journalList.filter(journal => {
        // Filter journals based on ledger (through account relationships)
        // This is a simplified filter since we'd need entry data for exact filtering
        return true; // For now, show all journals
      });

  const handleJournalCreated = (newJournal: JournalType) => {
    setJournalList([newJournal, ...journalList]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal Entries</h1>
          <p className="text-gray-600">
            Record and view all journal entries in the double-entry bookkeeping system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="flex items-center gap-2">
            <Icons.Download className="h-4 w-4" />
            Export Journal
          </Button>
          <AddJournal 
            accounts={accounts} 
            ledgers={ledgers}
            onJournalCreated={handleJournalCreated}
          />
        </div>
      </div>

      {/* Ledger Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={selectedLedger === "all" ? "default" : "outline"}
              onClick={() => setSelectedLedger("all")}
              size="sm"
            >
              All Ledgers
            </Button>
            {ledgers.map((ledger) => (
              <Button
                key={ledger.id}
                variant={selectedLedger === ledger.id ? "default" : "outline"}
                onClick={() => setSelectedLedger(ledger.id)}
                size="sm"
              >
                {ledger.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredJournals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
                             <Icons.BookOpenCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No journal entries found</p>
              <p className="text-sm">Create your first journal entry to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJournals.map((journal) => (
                <ItemCard key={journal.id} journal={journal} accounts={accounts} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
