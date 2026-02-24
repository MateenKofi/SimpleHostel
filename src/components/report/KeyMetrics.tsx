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
  const occupancyPercentage = reportData?.totalRooms > 0
    ? ((reportData?.occupiedRooms || 0) / reportData?.totalRooms) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue Card */}
      <BentoCard variant="revenue" delay={0} className="card-glow">
        <div className="flex flex-col items-center text-center">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 mb-3">
            <BadgeCent className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">
            {formatCurrency(reportData?.totalRevenue)}
          </p>
          <div className="mt-3 pt-3 border-t border-border/60 w-full">
            <p className="text-xs text-muted-foreground">
              {reportData?.totalPayments} payments made
            </p>
          </div>
        </div>
      </BentoCard>

      {/* Total Residents Card */}
      <BentoCard variant="residents" delay={75} className="card-glow">
        <div className="flex flex-col items-center text-center">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-sage-green-50 to-teal-green-50 dark:from-sage-green-950/30 dark:to-teal-green-950/20 mb-3">
            <Users className="h-5 w-5 text-sage-green-700 dark:text-sage-green-400" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Residents</p>
          <p className="text-2xl sm:text-3xl font-bold text-sage-green-700 dark:text-sage-green-400 mt-2">
            {reportData?.totalResidents}
          </p>
          <div className="mt-3 pt-3 border-t border-border/60 w-full">
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(reportData?.averageRevenuePerResident)}/resident
            </p>
          </div>
        </div>
      </BentoCard>

      {/* Room Occupancy Card */}
      <BentoCard variant="occupancy" delay={150} className="card-glow">
        <div className="flex flex-col items-center text-center">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-forest-green-50 to-sage-green-50 dark:from-forest-green-950/30 dark:to-sage-green-950/20 mb-3">
            <Building className="h-5 w-5 text-forest-green-700 dark:text-forest-green-400" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Room Occupancy</p>
          <p className="text-2xl sm:text-3xl font-bold text-forest-green-700 dark:text-forest-green-400 mt-2">
            {reportData?.occupancyRate}%
          </p>
          <Progress
            value={occupancyPercentage}
            className="mt-3 h-2 w-full max-w-[120px]"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {reportData?.occupiedRooms} of {reportData?.totalRooms} rooms
          </p>
        </div>
      </BentoCard>

      {/* Average Payment Card */}
      <BentoCard variant="staff" delay={225} className="card-glow">
        <div className="flex flex-col items-center text-center">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-green-50 to-forest-green-50 dark:from-teal-green-950/30 dark:to-forest-green-950/20 mb-3">
            <CreditCard className="h-5 w-5 text-teal-green-600 dark:text-teal-green-400" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Avg Payment</p>
          <p className="text-2xl sm:text-3xl font-bold text-teal-green-700 dark:text-teal-green-400 mt-2">
            {formatCurrency(reportData?.averagePaymentAmount)}
          </p>
          <div className="mt-3 pt-3 border-t border-border/60 w-full">
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
