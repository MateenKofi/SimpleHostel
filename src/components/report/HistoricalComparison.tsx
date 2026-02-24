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
  // Calculate revenue growth since API doesn't return it
  const revenueGrowth = reportData?.historicalRevenue && reportData?.historicalRevenue > 0
    ? ((reportData?.totalRevenue - reportData?.historicalRevenue) / reportData?.historicalRevenue) * 100
    : 0;

  const isPositiveGrowth = revenueGrowth >= 0;
  const hasHistoricalData = reportData?.historicalRevenue > 0 || reportData?.historicalResidents > 0;
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
                  {reportData?.totalResidents} resident{reportData?.totalResidents !== 1 ? "s" : ""}
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
              <p className="text-sm font-semibold text-sage-green-700 dark:text-sage-green-400">
                {hasHistoricalData ? "Historical" : "N/A"}
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {hasHistoricalData ? formatCurrency(reportData?.historicalRevenue) : "—"}
                </p>
                <p className="text-sm text-muted-foreground">Previous Revenue</p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-sage-green-200/50 dark:border-sage-green-800/30">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {hasHistoricalData
                    ? `${reportData?.historicalResidents} resident${reportData?.historicalResidents !== 1 ? "s" : ""}`
                    : "No previous data"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Summary */}
        <div className={`mt-6 p-4 rounded-xl flex items-center justify-between ${
          hasHistoricalData
            ? isPositiveGrowth
              ? "bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30"
              : "bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30"
            : "bg-muted/30 border border-border/50"
        }`}>
          <div className="flex items-center gap-3">
            {hasHistoricalData ? (
              isPositiveGrowth ? (
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              )
            ) : (
              <Calendar className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className={`text-sm font-semibold ${
                hasHistoricalData
                  ? isPositiveGrowth
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-amber-700 dark:text-amber-400"
                  : "text-muted-foreground"
              }`}>
                {hasHistoricalData
                  ? (isPositiveGrowth ? "Revenue Growth" : "Revenue Decline")
                  : "No Historical Data"
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {hasHistoricalData
                  ? "Compared to previous period"
                  : "Historical comparison not available"
                }
              </p>
            </div>
          </div>
          <p className={`text-2xl font-bold ${
            hasHistoricalData
              ? isPositiveGrowth
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-amber-700 dark:text-amber-400"
              : "text-muted-foreground"
          }`}>
            {hasHistoricalData
              ? `${isPositiveGrowth ? "+" : ""}${revenueGrowth.toFixed(1)}%`
              : "—"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalComparison;
