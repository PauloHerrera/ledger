import {
  totalAssets,
  totalLiabilities,
  totalEquity,
  totalRevenue,
} from "@/lib/fake-data";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Icons } from "@repo/ui/icons";

export default function Summary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <Icons.TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalAssets.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Liabilities
          </CardTitle>
          <Icons.TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalLiabilities.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">-5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Owners Equity</CardTitle>
          <Icons.DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalEquity.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">+8% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          <Icons.Calculator className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${(totalRevenue - 2000).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Current period</p>
        </CardContent>
      </Card>
    </div>
  );
}
