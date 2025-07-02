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

export default function AddJournal() {
  const [newEntry, setNewEntry] = useState({
    description: "",
    reference: "",
    entries: [{ account: "", debit: "", credit: "" }],
  });

  const addEntryLine = () => {
    setNewEntry({
      ...newEntry,
      entries: [...newEntry.entries, { account: "", debit: "", credit: "" }],
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Icons.Plus className="w-4 h-4 mr-2" />
          New Journal Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Journal Entry</DialogTitle>
          <DialogDescription>
            Add a new double-entry journal entry to your books.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Transaction description"
                value={newEntry.description}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                placeholder="Reference number"
                value={newEntry.reference}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, reference: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Journal Entries</Label>
            {newEntry.entries.map((entry, index) => (
              <div key={index} className="grid grid-cols-4 gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="accounts-receivable">
                      Accounts Receivable
                    </SelectItem>
                    <SelectItem value="office-supplies">
                      Office Supplies
                    </SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="accounts-payable">
                      Accounts Payable
                    </SelectItem>
                    <SelectItem value="service-revenue">
                      Service Revenue
                    </SelectItem>
                    <SelectItem value="rent-expense">Rent Expense</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Debit" type="number" />
                <Input placeholder="Credit" type="number" />
                <Button variant="outline" size="sm">
                  Remove
                </Button>
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
          <Button className="w-full">Create Entry</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
