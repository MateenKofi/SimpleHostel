import { Progress } from '@/components/ui/progress'
import { Banknote, Percent, Users, House, DoorOpen, Building2 } from 'lucide-react'
import { Analytics } from '@/helper/types/types'
import BentoCard from './BentoCard'
import AnimatedValue from './AnimatedValue'

type analyticsData = Analytics

// Icon container gradients by type
const iconContainers = {
  revenue: "p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",
  occupancy: "p-2.5 rounded-xl bg-gradient-to-br from-forest-green-50 to-sage-green-50 dark:from-forest-green-950/30 dark:to-sage-green-950/20",
  debt: "p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-warm-red-50 dark:from-amber-950/30 dark:to-warm-red-950/20",
  residents: "p-2.5 rounded-xl bg-gradient-to-br from-sage-green-50 to-teal-green-50 dark:from-sage-green-950/30 dark:to-teal-green-950/20",
  staff: "p-2.5 rounded-xl bg-gradient-to-br from-teal-green-50 to-forest-green-50 dark:from-teal-green-950/30 dark:to-forest-green-950/20",
  default: "p-2.5 rounded-xl bg-gradient-to-br from-muted to-muted/50",
}

const iconClasses = {
  revenue: "text-emerald-600 dark:text-emerald-400",
  occupancy: "text-forest-green-700 dark:text-forest-green-400",
  debt: "text-amber-600 dark:text-amber-400",
  residents: "text-sage-green-700 dark:text-sage-green-400",
  staff: "text-teal-green-600 dark:text-teal-green-400",
  default: "text-muted-foreground",
}

const valueClass = "text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight"
const labelClass = "text-sm font-medium text-muted-foreground"

const AnalyticsCard = ({ analyticsData }: { analyticsData: analyticsData }) => {
  // Resident-specific cards when data has resident structure
  if (analyticsData?.residentId) {
    const totalPaid = analyticsData?.totals?.totalPaid || 0
    const outstandingBalance = analyticsData?.totals?.outstandingBalance || 0
    const roomType = analyticsData?.room?.roomType || "Not assigned"
    const roomNumber = analyticsData?.room?.roomNumber || "Not assigned"
    const hostelName = analyticsData?.currentHostel?.name || "Not assigned"

    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Paid Card - Revenue theme */}
        <BentoCard variant="revenue" delay={0}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className={labelClass}>Total Paid</p>
              <p className={`${valueClass} mt-3 text-emerald-700 dark:text-emerald-400`}>
                GH₵<AnimatedValue value={totalPaid} format="currency" decimals={2} duration={800} />
              </p>
            </div>
            <div className={iconContainers.revenue + " shrink-0"}>
              <Banknote className={`h-5 w-5 ${iconClasses.revenue}`} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60">
            <p className="text-xs text-muted-foreground">Your total payments</p>
          </div>
        </BentoCard>

        {/* Outstanding Balance Card - Debt theme */}
        <BentoCard variant="debt" delay={75}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className={labelClass}>Outstanding Balance</p>
              <p className={`${valueClass} mt-3 ${outstandingBalance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                GH₵<AnimatedValue value={outstandingBalance} format="currency" decimals={2} duration={800} />
              </p>
            </div>
            <div className={iconContainers.debt + " shrink-0"}>
              <Banknote className={`h-5 w-5 ${iconClasses.debt}`} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60">
            <p className="text-xs text-muted-foreground">
              {outstandingBalance > 0 ? 'Payment pending' : 'All clear!'}
            </p>
          </div>
        </BentoCard>

        {/* Room Details Card - Occupancy theme */}
        <BentoCard variant="occupancy" delay={150}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className={labelClass}>Room Details</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <House className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-base sm:text-lg font-semibold text-foreground truncate">{roomType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-base sm:text-lg font-semibold text-foreground truncate">{roomNumber}</p>
                </div>
              </div>
            </div>
            <div className={iconContainers.occupancy + " shrink-0"}>
              <House className={`h-5 w-5 ${iconClasses.occupancy}`} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60">
            <p className="text-xs text-muted-foreground">Your accommodation</p>
          </div>
        </BentoCard>

        {/* Current Hostel Card - Staff theme */}
        <BentoCard variant="staff" delay={225}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className={labelClass}>Current Hostel</p>
              <p className={`${valueClass} mt-3 text-teal-700 dark:text-teal-400 truncate`}>
                {hostelName}
              </p>
            </div>
            <div className={iconContainers.staff + " shrink-0"}>
              <Building2 className={`h-5 w-5 ${iconClasses.staff}`} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60">
            <p className="text-xs text-muted-foreground">Your location</p>
          </div>
        </BentoCard>
      </div>
    )
  }

  // Admin/SuperAdmin cards with modern bento grid layout
  const hasDebtCard = analyticsData?.totalHostels > -1

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-3 w-full">
      {/* Combined Revenue & Occupancy Card - Spans 2 columns */}
      <BentoCard variant="revenue" colSpan={2} delay={0} className="lg:col-span-2 w-full">
        <div className="flex flex-col items-center justify-center py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
            {/* Total Revenue Section */}
            <div className="flex flex-col items-center text-center">
              <div className={iconContainers.revenue + " mb-3"}>
                <Banknote className={`h-6 w-6 ${iconClasses.revenue}`} />
              </div>
              <p className={labelClass}>Total Revenue</p>
              <p className={`${valueClass} mt-3 text-emerald-700 dark:text-emerald-400`}>
                GH₵<AnimatedValue value={analyticsData?.totalRevenue || 0} format="currency" decimals={2} duration={1000} />
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                of GH₵{(analyticsData?.expectedIncome || 0).toFixed(2)} potential revenue
              </p>
              {/* Progress bar with gradient */}
              <div className="mt-4 w-full max-w-[200px]">
                <Progress
                  value={analyticsData?.expectedIncome > 0 ? (analyticsData?.totalRevenue / analyticsData?.expectedIncome) * 100 : 0}
                  className="bg-muted/50 h-2"
                />
              </div>
            </div>

            {/* Occupancy Rate Section */}
            <div className="flex flex-col items-center text-center">
              <div className={iconContainers.occupancy + " mb-3"}>
                <Percent className={`h-6 w-6 ${iconClasses.occupancy}`} />
              </div>
              <p className={labelClass}>Occupancy Rate</p>
              <p className={`${valueClass} mt-3 text-forest-green-700 dark:text-forest-green-400`}>
                <AnimatedValue value={analyticsData?.occupancyRate || 0} format="number" decimals={1} duration={800} />%
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {analyticsData?.occupiedRooms || 0} of {analyticsData?.activeRooms || 0} rooms occupied
              </p>
              <div className="mt-4 w-full max-w-[200px]">
                <Progress
                  value={analyticsData?.occupancyRate || 0}
                  className="bg-muted/50 h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Right Column - Staff & Residents stacked */}
      <div className="flex flex-col gap-3 sm:gap-4 w-full">
        {/* Total Staff Card */}
        <BentoCard variant="staff" delay={150} className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className={labelClass}>Total Staff</p>
              <p className={`${valueClass} mt-3 text-teal-700 dark:text-teal-400`}>
                <AnimatedValue value={analyticsData?.totalStaff || 0} format="number" duration={600} />
              </p>
            </div>
            <div className={iconContainers.staff + " shrink-0"}>
              <Users className={`h-6 w-6 ${iconClasses.staff}`} />
            </div>
          </div>
        </BentoCard>

        {/* Total Residents Card */}
        <BentoCard variant="residents" delay={225} className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className={labelClass}>Total Residents</p>
              <p className={`${valueClass} mt-3 text-sage-green-700 dark:text-sage-green-400`}>
                <AnimatedValue value={analyticsData?.totalResidents || 0} format="number" duration={700} />
              </p>
            </div>
            <div className={iconContainers.residents + " shrink-0"}>
              <Users className={`h-6 w-6 ${iconClasses.residents}`} />
            </div>
          </div>
        </BentoCard>

        {/* Total Debt Card - Only show if hostels data exists */}
        {hasDebtCard && (
          <BentoCard variant="debt" delay={300} className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className={labelClass}>Total Debt</p>
                <p className={`${valueClass} mt-3 text-amber-600 dark:text-amber-400`}>
                  GH₵<AnimatedValue value={analyticsData?.totalDebt || 0} format="currency" decimals={2} duration={800} />
                </p>
              </div>
              <div className={iconContainers.debt + " shrink-0"}>
                <Banknote className={`h-6 w-6 ${iconClasses.debt}`} />
              </div>
            </div>
          </BentoCard>
        )}
      </div>
    </div>
  )
}

export default AnalyticsCard
