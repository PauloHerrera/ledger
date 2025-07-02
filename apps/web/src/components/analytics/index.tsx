import Summary from "./summary";
import Charts from "./charts";

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Accounting Dashboard</h1>
      <p className="text-gray-600">Double Entry Bookkeeping System</p>
      <Summary />
      <Charts />
    </div>
  );
}
