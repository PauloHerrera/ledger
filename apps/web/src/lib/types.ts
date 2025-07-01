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
}

export interface AccountsApiResponse {
  data?: Account[];
  accounts?: Account[];
}

export const navigation = [
  { name: "Dashboard", href: "/", icon: Icons.Home },
  { name: "Analytics", href: "/analytics", icon: Icons.BarChart2 },
  { name: "Ledger", href: "/ledger", icon: Icons.BookOpenCheck },
  { name: "Accounts", href: "/accounts", icon: Icons.BookUser },
  { name: "Transactions", href: "/transactions", icon: Icons.Wallet },
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
