"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/select";
import { Icons } from "@repo/ui/icons";
import { Label } from "@repo/ui/label";
import { Account, Ledger, Journal, CreateJournalRequest } from "@/lib/types";
import { createJournal } from "@/lib/api";

interface AddJournalProps {
  accounts: Account[];
  ledgers: Ledger[];
  onJournalCreated: (journal: Journal) => void;
}

export default function AddJournal({ accounts, ledgers, onJournalCreated }: AddJournalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    event: "",
    description: "",
    postingDate: new Date().toISOString().split('T')[0],
    amount: "",
    metadata: {
      userId: "",
      borrower: "",
      loanId: "",
      lentAt: ""
    },
    entries: [
      { accountId: "", amount: "", direction: "debit" as const, description: "" },
      { accountId: "", amount: "", direction: "credit" as const, description: "" }
    ],
  });

  const addEntryLine = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { accountId: "", amount: "", direction: "debit", description: "" }],
    });
  };

  const removeEntryLine = (index: number) => {
    if (formData.entries.length > 2) {
      const newEntries = formData.entries.filter((_, i) => i !== index);
      setFormData({ ...formData, entries: newEntries });
    }
  };

  const updateEntry = (index: number, field: keyof typeof formData.entries[0], value: string) => {
    const newEntries = [...formData.entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setFormData({ ...formData, entries: newEntries });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const journalData: CreateJournalRequest = {
        transactionId: crypto.randomUUID(),
        name: formData.name,
        event: formData.event,
        description: formData.description,
        postingDate: formData.postingDate + " 00:00:00",
        amount: parseFloat(formData.amount),
        metadata: formData.metadata,
        entries: formData.entries.map(entry => ({
          accountId: entry.accountId,
          amount: parseFloat(entry.amount),
          direction: entry.direction,
          description: entry.description
        }))
      };

      const result = await createJournal(journalData);
      if (result) {
        onJournalCreated(result);
        setIsOpen(false);
        // Reset form
        setFormData({
          name: "",
          event: "",
          description: "",
          postingDate: new Date().toISOString().split('T')[0],
          amount: "",
          metadata: { userId: "", borrower: "", loanId: "", lentAt: "" },
          entries: [
            { accountId: "", amount: "", direction: "debit", description: "" },
            { accountId: "", amount: "", direction: "credit", description: "" }
          ],
        });
      }
    } catch (error) {
      console.error("Failed to create journal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icons.Plus className="w-4 h-4 mr-2" />
          New Journal Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Journal Entry</DialogTitle>
          <DialogDescription>
            Add a new double-entry journal entry to your books.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Journal entry name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="event">Event</Label>
              <Input
                id="event"
                placeholder="loan_disbursement, payment, etc."
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Transaction description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="postingDate">Posting Date</Label>
              <Input
                id="postingDate"
                type="date"
                value={formData.postingDate}
                onChange={(e) => setFormData({ ...formData, postingDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Total Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="3000.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Journal Entries</Label>
            {formData.entries.map((entry, index) => (
              <div key={index} className="grid grid-cols-6 gap-2 items-end">
                <div>
                  <Select value={entry.accountId} onValueChange={(value) => updateEntry(index, "accountId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({account.accountType})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input 
                    placeholder="Amount" 
                    type="number" 
                    step="0.01"
                    value={entry.amount}
                    onChange={(e) => updateEntry(index, "amount", e.target.value)}
                  />
                </div>
                <div>
                  <Select value={entry.direction} onValueChange={(value) => updateEntry(index, "direction", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debit">Debit</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input 
                    placeholder="Description" 
                    value={entry.description}
                    onChange={(e) => updateEntry(index, "description", e.target.value)}
                  />
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeEntryLine(index)}
                    disabled={formData.entries.length <= 2}
                  >
                    Remove
                  </Button>
                </div>
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

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={loading || !formData.name || !formData.event || formData.entries.length < 2}
          >
            {loading ? "Creating..." : "Create Entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
