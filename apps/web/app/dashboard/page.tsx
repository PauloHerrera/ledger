import { Card } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import Link from "next/link";

// Mock data for dashboard
const mockStats = [
  {
    title: "Total Accounts",
    value: "24",
    change: "+2 from last month",
    trend: "up" as const,
  },
  {
    title: "Total Balance",
    value: "$45,231.89",
    change: "+20.1% from last month",
    trend: "up" as const,
  },
  {
    title: "Active Ledgers",
    value: "12",
    change: "+1 from last month",
    trend: "up" as const,
  },
  {
    title: "Recent Transactions",
    value: "156",
    change: "+12% from last week",
    trend: "up" as const,
  },
];

const mockRecentActivity = [
  {
    id: 1,
    type: "Account Created",
    description: "New checking account opened",
    amount: "$1,000.00",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    type: "Transfer",
    description: "Transfer to savings account",
    amount: "$500.00",
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: 3,
    type: "Journal Entry",
    description: "Monthly reconciliation",
    amount: "$2,340.50",
    date: "2024-01-13",
    status: "pending",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/accounts">
            <Button>View Accounts</Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">{stat.title}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20m9-9H3" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4 mt-4">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">{activity.amount}</p>
                  <Badge 
                    variant={activity.status === "completed" ? "default" : "secondary"}
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3 p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button className="w-full justify-start" variant="ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="mr-2 h-4 w-4"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="m22 21-3-3m0 0a2 2 0 0 0 0-4 2 2 0 0 0 0 4z" />
              </svg>
              Create Account
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="mr-2 h-4 w-4"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
              New Journal Entry
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="mr-2 h-4 w-4"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Create Ledger
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}