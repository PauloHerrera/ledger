// Sample data for the accounting system
export const journalEntries = [
  {
    id: "JE001",
    date: "2024-01-15",
    description: "Office supplies purchase",
    reference: "INV-001",
    entries: [
      { account: "Office Supplies", debit: 250.0, credit: 0 },
      { account: "Cash", debit: 0, credit: 250.0 },
    ],
  },
  {
    id: "JE002",
    date: "2024-01-16",
    description: "Service revenue",
    reference: "INV-002",
    entries: [
      { account: "Cash", debit: 1500.0, credit: 0 },
      { account: "Service Revenue", debit: 0, credit: 1400.0 },
      { account: "Interest Income", debit: 0, credit: 100.0 },
    ],
  },
  {
    id: "JE003",
    date: "2024-01-17",
    description: "Rent payment",
    reference: "RENT-001",
    entries: [
      { account: "Rent Expense", debit: 2000.0, credit: 0 },
      { account: "Cash", debit: 0, credit: 2000.0 },
    ],
  },
  {
    id: "JE004",
    date: "2024-01-18",
    description: "Equipment purchase",
    reference: "EQ-001",
    entries: [
      { account: "Equipment", debit: 5000.0, credit: 0 },
      { account: "Accounts Payable", debit: 0, credit: 5000.0 },
    ],
  },
];

export const accountBalances = [
  { account: "Cash", type: "Asset", balance: 8750.0 },
  { account: "Accounts Receivable", type: "Asset", balance: 3200.0 },
  { account: "Office Supplies", type: "Asset", balance: 250.0 },
  { account: "Equipment", type: "Asset", balance: 5000.0 },
  { account: "Accounts Payable", type: "Liability", balance: 5000.0 },
  { account: "Service Revenue", type: "Revenue", balance: 1500.0 },
  { account: "Rent Expense", type: "Expense", balance: 2000.0 },
  { account: "Owner's Equity", type: "Equity", balance: 10700.0 },
];

export const monthlyData = [
  { month: "Jan", revenue: 15000, expenses: 8000 },
  { month: "Feb", revenue: 18000, expenses: 9500 },
  { month: "Mar", revenue: 22000, expenses: 11000 },
  { month: "Apr", revenue: 19000, expenses: 10200 },
  { month: "May", revenue: 25000, expenses: 12500 },
  { month: "Jun", revenue: 28000, expenses: 14000 },
];

export const accountTypeData = [
  { name: "Assets", value: 17200, color: "#0088FE" },
  { name: "Liabilities", value: 5000, color: "#00C49F" },
  { name: "Equity", value: 10700, color: "#FFBB28" },
  { name: "Revenue", value: 1500, color: "#FF8042" },
];

export const totalAssets = accountBalances
  .filter((acc) => acc.type === "Asset")
  .reduce((sum, acc) => sum + acc.balance, 0);
export const totalLiabilities = accountBalances
  .filter((acc) => acc.type === "Liability")
  .reduce((sum, acc) => sum + acc.balance, 0);
export const totalEquity = accountBalances
  .filter((acc) => acc.type === "Equity")
  .reduce((sum, acc) => sum + acc.balance, 0);
export const totalRevenue = accountBalances
  .filter((acc) => acc.type === "Revenue")
  .reduce((sum, acc) => sum + acc.balance, 0);
