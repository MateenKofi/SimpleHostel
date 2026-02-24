import { ReportData } from "@/helper/types/types";
import { formatDate } from "@/utils/formatDate";
import { CalendarDays, BadgeCent, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { formatCurrency } from "@/utils/formatCurrency";
import BentoCard from "../dashboard/BentoCard";

const StatusCards = ({reportData}: {reportData: ReportData}) => {
  const isGrowthPositive = reportData?.revenueGrowth >= 0;

  return (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Academic Year Card */}
        <BentoCard variant="occupancy" delay={0} className="card-glow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {reportData?.calendarYearName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Started: {formatDate(reportData?.startDate)}
              </p>
              <Badge
                variant={reportData?.isActive ? "default" : "secondary"}
                className={`mt-3 ${
                  reportData?.isActive
                    ? "bg-forest-green-600 hover:bg-forest-green-700 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {reportData?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-forest-green-50 to-sage-green-50 dark:from-forest-green-950/30 dark:to-sage-green-950/20">
              <CalendarDays className="h-5 w-5 text-forest-green-600 dark:text-forest-green-400" />
            </div>
          </div>
        </BentoCard>

        {/* Revenue Growth Card */}
        <BentoCard
          variant={isGrowthPositive ? "revenue" : "debt"}
          delay={75}
          className="card-glow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Revenue Growth</p>
              <p
                className={`text-2xl font-bold mt-2 ${
                  isGrowthPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {isGrowthPositive ? "+" : ""}
                {reportData?.revenueGrowth?.toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Compared to previous period
              </p>
              <div className={`flex items-center gap-1 mt-3 ${isGrowthPositive ? "text-emerald-600" : "text-amber-600"}`}>
                {isGrowthPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-xs font-medium">
                  {isGrowthPositive ? "Growth" : "Decline"}
                </span>
              </div>
            </div>
            <div className={`p-2.5 rounded-xl ${
              isGrowthPositive
                ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20"
                : "bg-gradient-to-br from-amber-50 to-warm-red-50 dark:from-amber-950/30 dark:to-warm-red-950/20"
            }`}>
              {isGrowthPositive ? (
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
          </div>
        </BentoCard>

        {/* Collection Rate Card */}
        <BentoCard variant="staff" delay={150} className="card-glow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {reportData?.collectionRate?.toFixed(1)}%
              </p>
              <Progress
                value={reportData?.collectionRate}
                className="mt-3 h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formatCurrency(reportData?.totalRevenue)} of{" "}
                {formatCurrency(reportData?.totalExpectedRevenue)}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-green-50 to-forest-green-50 dark:from-teal-green-950/30 dark:to-forest-green-950/20">
              <BadgeCent className="h-5 w-5 text-teal-green-600 dark:text-teal-green-400" />
            </div>
          </div>
        </BentoCard>
      </div>
  )
}

export default StatusCards
