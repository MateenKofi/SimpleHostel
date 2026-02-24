import { ReportData } from "@/helper/types/types";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  BadgeCent,
  Users,
  Building,
  CreditCard,
} from "lucide-react";
import BentoCard from "../dashboard/BentoCard";
import { Progress } from "../ui/progress";

const KeyMetrics = ({ reportData }: { reportData: ReportData }) => {
  // Use backend's occupancyRate for consistency
  const occupancyPercentage = reportData?.occupancyRate ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {/* Total Revenue Card */}
      <BentoCard variant="revenue" delay={0}>
        <div className="flex flex-col items-center text-center">
          <div className="p-2 md:p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 mb-2 md:mb-3">
            <BadgeCent className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Revenue</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-1 md:mt-2 break-all">
            {formatCurrency(reportData?.totalRevenue)}
          </p>
          <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border/60 w-full">
            <p className="text-xs text-muted-foreground">
              {reportData?.totalPayments} payment{reportData?.totalPayments !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </BentoCard>

      {/* Total Residents Card */}
      <BentoCard variant="residents" delay={75}>
        <div className="flex flex-col items-center text-center">
          <div className="p-2 md:p-2.5 rounded-xl bg-gradient-to-br from-sage-green-50 to-teal-green-50 dark:from-sage-green-950/30 dark:to-teal-green-950/20 mb-2 md:mb-3">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-sage-green-700 dark:text-sage-green-400" />
          </div>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">Residents</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-sage-green-700 dark:text-sage-green-400 mt-1 md:mt-2">
            {reportData?.totalResidents}
          </p>
          <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border/60 w-full">
            <p className="text-xs text-muted-foreground">
              {formatCurrency(reportData?.averageRevenuePerResident)}/resident
            </p>
          </div>
        </div>
      </BentoCard>

      {/* Room Occupancy Card */}
      <BentoCard variant="occupancy" delay={150}>
        <div className="flex flex-col items-center text-center">
          <div className="p-2 md:p-2.5 rounded-xl bg-gradient-to-br from-forest-green-50 to-sage-green-50 dark:from-forest-green-950/30 dark:to-sage-green-950/20 mb-2 md:mb-3">
            <Building className="h-4 w-4 md:h-5 md:w-5 text-forest-green-700 dark:text-forest-green-400" />
          </div>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">Occupancy</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-forest-green-700 dark:text-forest-green-400 mt-1 md:mt-2">
            {reportData?.occupancyRate}%
          </p>
          <Progress
            value={occupancyPercentage}
            className="mt-2 md:mt-3 h-2 w-full max-w-[100px] md:max-w-[120px]"
          />
          <p className="text-xs text-muted-foreground mt-1.5 md:mt-2">
            {reportData?.occupiedRooms}/{reportData?.totalRooms} rooms
          </p>
        </div>
      </BentoCard>

      {/* Average Payment Card */}
      <BentoCard variant="staff" delay={225} className="col-span-2 md:col-span-3 lg:col-span-1">
        <div className="flex flex-col items-center text-center">
          <div className="p-2 md:p-2.5 rounded-xl bg-gradient-to-br from-teal-green-50 to-forest-green-50 dark:from-teal-green-950/30 dark:to-forest-green-950/20 mb-2 md:mb-3">
            <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-teal-green-600 dark:text-teal-green-400" />
          </div>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">Avg Payment</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-green-700 dark:text-teal-green-400 mt-1 md:mt-2">
            {formatCurrency(reportData?.averagePaymentAmount)}
          </p>
          <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border/60 w-full">
            <p className="text-xs text-muted-foreground">
              Room: {formatCurrency(reportData?.averageRoomPrice)}
            </p>
          </div>
        </div>
      </BentoCard>
    </div>
  )
}

export default KeyMetrics
