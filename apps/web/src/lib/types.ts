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
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Journal {
  id: string;
  code: number;
  name: string;
  description?: string;
  journalEvent: string;
  metadata?: Record<string, any>;
  postingDate: string;
  createdAt: string;
  updatedAt: string;
  entries?: Entry[];
}

export interface Entry {
  id: string;
  code: number;
  journalId: string;
  accountId: string;
  description?: string;
  amount: string;
  direction: "debit" | "credit";
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
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
  metadata?: Record<string, any>;
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
  { name: "Accounts", href: "/account", icon: Icons.BookUser },
  { name: "Journal", href: "/journal", icon: Icons.Wallet },
  { name: "Analytics", href: "/analytics", icon: Icons.BarChart2 },
  { name: "Organization", href: "/organization", icon: Icons.Building2 },
  { name: "Projects", href: "/projects", icon: Icons.Folder },
  { name: "Invoices", href: "/invoices", icon: Icons.Receipt },
  { name: "Payments", href: "/payments", icon: Icons.CreditCard },
  { name: "Members", href: "/members", icon: Icons.Users2 },
  { name: "Permissions", href: "/permissions", icon: Icons.Shield },
  { name: "Meetings", href: "/meetings", icon: Icons.Video },
] as NavigationItem[];

export const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Icons.Settings },
  { name: "Help", href: "/help", icon: Icons.HelpCircle },
] as NavigationItem[];
