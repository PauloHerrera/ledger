import { journalEntries } from "@/lib/fake-data";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import ItemCard from "./item-card";
import AddJournal from "./add-journal";

export default function Journal() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
          <p className="text-gray-600">
            Traditional T-account representation of journal entries
          </p>
        </div>
        <AddJournal />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>T-Account View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {journalEntries.map((entry) => (
              <ItemCard key={entry.id} entry={entry} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
