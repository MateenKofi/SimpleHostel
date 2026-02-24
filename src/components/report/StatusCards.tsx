import { ReportData } from "@/helper/types/types";
import { formatDate } from "@/utils/formatDate";
import { CalendarDays, BadgeCent, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { formatCurrency } from "@/utils/formatCurrency";
import BentoCard from "../dashboard/BentoCard";

const StatusCards = ({reportData}: {reportData: ReportData}) => {
  // Calculate revenue growth since API doesn't return it
  const revenueGrowth = reportData?.historicalRevenue && reportData?.historicalRevenue > 0
    ? ((reportData?.totalRevenue - reportData?.historicalRevenue) / reportData?.historicalRevenue) * 100
    : 0;

  const isGrowthPositive = revenueGrowth >= 0;

  return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Academic Year Card */}
        <BentoCard variant="occupancy" delay={0}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Academic Year</p>
              <p className="text-lg md:text-2xl font-bold text-foreground mt-1.5 md:mt-2 truncate">
                {reportData?.calendarYearName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Started: {formatDate(reportData?.startDate)}
              </p>
              <Badge
                variant={reportData?.isActive ? "default" : "secondary"}
                className={`mt-2 md:mt-3 ${
                  reportData?.isActive
                    ? "bg-forest-green-600 hover:bg-forest-green-700 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {reportData?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="p-2 md:p-2.5 rounded-xl bg-gradient-to-br from-forest-green-50 to-sage-green-50 dark:from-forest-green-950/30 dark:to-sage-green-950/20 shrink-0">
              <CalendarDays className="h-4 w-4 md:h-5 md:w-5 text-forest-green-600 dark:text-forest-green-400" />
            </div>
          </div>
        </BentoCard>

        {/* Revenue Growth Card */}
        <BentoCard
          variant={isGrowthPositive ? "revenue" : "debt"}
          delay={75}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Revenue Growth</p>
              <p
                className={`text-lg md:text-2xl font-bold mt-1.5 md:mt-2 ${
                  isGrowthPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {isGrowthPositive ? "+" : ""}
                {revenueGrowth.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {reportData?.historicalRevenue > 0
                  ? "Compared to previous period"
                  : "No historical data"
                }
              </p>
              <div className={`flex items-center gap-1 mt-2 md:mt-3 ${isGrowthPositive ? "text-emerald-600" : "text-amber-600"}`}>
                {reportData?.historicalRevenue > 0 ? (
                  isGrowthPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  )
                ) : (
                  <CalendarDays className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                )}
                <span className="text-xs font-medium">
                  {reportData?.historicalRevenue > 0
                    ? (isGrowthPositive ? "Growth" : "Decline")
                    : "First period"
                  }
                </span>
              </div>
            </div>
            <div className={`p-2 md:p-2.5 rounded-xl shrink-0 ${
              isGrowthPositive && reportData?.historicalRevenue > 0
                ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20"
                : "bg-gradient-to-br from-sage-green-50 to-teal-green-50 dark:from-sage-green-950/30 dark:to-teal-green-950/20"
            }`}>
              {reportData?.historicalRevenue > 0 ? (
                isGrowthPositive ? (
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-amber-600 dark:text-amber-400" />
                )
              ) : (
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-sage-green-600 dark:text-sage-green-400" />
              )}
            </div>
          </div>
        </BentoCard>

        {/* Collection Rate Card */}
        <BentoCard variant="staff" delay={150} className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Collection Rate</p>
              <p className="text-lg md:text-2xl font-bold text-foreground mt-1.5 md:mt-2">
                {reportData?.collectionRate?.toFixed(1)}%
              </p>
              <Progress
                value={reportData?.collectionRate}
                className="mt-2 md:mt-3 h-2"
              />
              <p className="text-xs text-muted-foreground mt-1.5 md:mt-2">
                {formatCurrency(reportData?.totalRevenue)} of{" "}
                {formatCurrency(reportData?.totalExpectedRevenue)}
              </p>
            </div>
            <div className="p-2 md:p-2.5 rounded-xl bg-gradient-to-br from-teal-green-50 to-forest-green-50 dark:from-teal-green-950/30 dark:to-forest-green-950/20 shrink-0">
              <BadgeCent className="h-4 w-4 md:h-5 md:w-5 text-teal-green-600 dark:text-teal-green-400" />
            </div>
          </div>
        </BentoCard>
      </div>
  )
}

export default StatusCards
