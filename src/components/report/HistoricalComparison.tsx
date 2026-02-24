import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportData } from "@/helper/types/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { TrendingUp, TrendingDown, Calendar, Users } from "lucide-react";

const HistoricalComparison = ({ reportData }: { reportData: ReportData }) => {
  const revenueGrowth = reportData?.revenueGrowth || 0;
  const isPositiveGrowth = revenueGrowth >= 0;
  const residentGrowth = reportData?.historicalResidents > 0
    ? (((reportData?.totalResidents || 0) - reportData?.historicalResidents) / reportData?.historicalResidents) * 100
    : 0;

  return (
    <Card className="border-forest-green-200/50 dark:border-forest-green-800/30 bg-gradient-to-br from-forest-green-50/20 to-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-teal-green-500 to-sage-green-600">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle>Historical Comparison</CardTitle>
            <CardDescription>Current vs historical performance</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Period */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Current Period</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {formatCurrency(reportData?.totalRevenue)}
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/50 dark:border-emerald-800/30">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {reportData?.totalResidents} residents
                </p>
              </div>
            </div>
          </div>

          {/* Historical Period */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sage-green-50/80 to-forest-green-50/60 dark:from-sage-green-950/30 dark:to-forest-green-950/20 border border-sage-green-200/50 dark:border-sage-green-800/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-sage-green-100 dark:bg-sage-green-900/30">
                <Calendar className="h-4 w-4 text-sage-green-600 dark:text-sage-green-400" />
              </div>
              <p className="text-sm font-semibold text-sage-green-700 dark:text-sage-green-400">Historical</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {formatCurrency(reportData?.historicalRevenue)}
                </p>
                <p className="text-sm text-muted-foreground">Previous Revenue</p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-sage-green-200/50 dark:border-sage-green-800/30">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {reportData?.historicalResidents} residents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Summary */}
        <div className={`mt-6 p-4 rounded-xl flex items-center justify-between ${
          isPositiveGrowth
            ? "bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30"
            : "bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30"
        }`}>
          <div className="flex items-center gap-3">
            {isPositiveGrowth ? (
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            )}
            <div>
              <p className={`text-sm font-semibold ${
                isPositiveGrowth
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-amber-700 dark:text-amber-400"
              }`}>
                {isPositiveGrowth ? "Revenue Growth" : "Revenue Decline"}
              </p>
              <p className="text-xs text-muted-foreground">
                Compared to previous period
              </p>
            </div>
          </div>
          <p className={`text-2xl font-bold ${
            isPositiveGrowth
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-amber-700 dark:text-amber-400"
          }`}>
            {isPositiveGrowth ? "+" : ""}{revenueGrowth.toFixed(1)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalComparison;
