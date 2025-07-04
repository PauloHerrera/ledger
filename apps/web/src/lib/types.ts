import { Icons } from "@repo/ui/icons";

export type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export interface Account {
  id: string;
  name: string;
  accountType: string;
  balance: number;
  createdAt: string;
  ledgerId?: string;
}

export interface AccountBalance {
  accountId: string;
  accountName: string;
  accountType: string;
  totalAmountDebits: string;
  totalAmountCredits: string;
}

export interface AccountsApiResponse {
  data?: Account[];
  accounts?: Account[];
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  entries: JournalEntryLine[];
}

export interface JournalEntryLine {
  account: string;
  debit: number;
  credit: number;
}

// New types for API integration
export interface Ledger {
  id: string;
  name: string;
  description?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Journal {
  id: string;
  ledgerId: string;
  code: number;
  name: string;
  description?: string;
  journalEvent: string;
  metadata?: Record<string, string>;
  postingDate: string;
  entries?: Entry[];
}

export interface Entry {
  code: number;
  accountName: string;
  accountType: "asset" | "liability" | "equity" | "income" | "expense";
  amount: string;
  direction: "debit" | "credit";
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateJournalRequest {
  transactionId: string;
  name: string;
  event: string;
  description: string;
  postingDate: string;
  amount: number;
  metadata?: Record<string, string>;
  entries: {
    accountId: string;
    amount: number;
    direction: "debit" | "credit";
    description: string;
  }[];
}

export const navigation = [
  { name: "Dashboard", href: "/", icon: Icons.Home },
  { name: "Ledger", href: "/ledger", icon: Icons.BookOpenCheck },
  { name: "Journal", href: "/journal", icon: Icons.Wallet },
  { name: "Accounts", href: "/account", icon: Icons.BookUser },
  { name: "Analytics", href: "/analytics", icon: Icons.BarChart2 },
  { name: "Loan Events", href: "/loan-events", icon: Icons.Queue },
  // { name: "Payments", href: "/payments", icon: Icons.CreditCard },
  // { name: "Organization", href: "/organization", icon: Icons.Building2 },
  // { name: "Projects", href: "/projects", icon: Icons.Folder },
  // { name: "Invoices", href: "/invoices", icon: Icons.Receipt },
  // { name: "Permissions", href: "/permissions", icon: Icons.Shield },
  // { name: "Meetings", href: "/meetings", icon: Icons.Video },
] as NavigationItem[];

export const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Icons.Settings },
  { name: "Help", href: "/help", icon: Icons.HelpCircle },
] as NavigationItem[];
