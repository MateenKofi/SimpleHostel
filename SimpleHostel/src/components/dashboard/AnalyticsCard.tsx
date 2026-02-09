import { Progress } from '@/components/ui/progress'
import { Banknote, Percent, Users, House, DoorOpen, Building2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Analytics } from '@/helper/types/types'

type analyticsData = Analytics

// Floating card base class
const floatingCard = "bg-gradient-to-br from-card to-muted/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border/50"

// Icon container with gradient
const iconContainer = "p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50"
const iconContainerWarning = "p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50"
const iconContainerInfo = "p-2.5 rounded-xl bg-gradient-to-br from-forest-green-50 to-forest-green-100/50"
const iconContainerTeal = "p-2.5 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50"

const iconClass = "h-5 w-5"
const valueClass = "text-2xl font-bold text-foreground"
const labelClass = "text-sm font-medium text-muted-foreground"

const AnalyticsCard = ({ analyticsData }: { analyticsData: analyticsData }) => {
  // Resident-specific cards when data has resident structure
  if (analyticsData?.residentId) {
    const totalPaid = analyticsData?.totals?.totalPaid || 0
    const outstandingBalance = analyticsData?.totals?.outstandingBalance || 0
    const roomType = analyticsData?.room?.roomType || "Not assigned"
    const roomNumber = analyticsData?.room?.roomNumber || "Not assigned"
    const hostelName = analyticsData?.hostel?.hostelName || "Not assigned"

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Paid Card - Success theme */}
        <Card className={floatingCard}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={labelClass}>Total Paid</p>
                <p className={`${valueClass} mt-2 text-emerald-700`}>
                  GH₵{totalPaid.toFixed(2)}
                </p>
              </div>
              <div className={iconContainer}>
                <Banknote className={`${iconClass} text-emerald-600`} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Your total payments</p>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Balance Card - Warning theme */}
        <Card className={floatingCard}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={labelClass}>Outstanding Balance</p>
                <p className={`${valueClass} mt-2 ${outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  GH₵{outstandingBalance.toFixed(2)}
                </p>
              </div>
              <div className={iconContainerWarning}>
                <Banknote className={`${iconClass} text-amber-600`} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {outstandingBalance > 0 ? 'Payment pending' : 'All clear!'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Room Details Card - Info theme */}
        <Card className={floatingCard}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={labelClass}>Room Details</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <House className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-lg font-semibold text-foreground">{roomType}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-lg font-semibold text-foreground">{roomNumber}</p>
                  </div>
                </div>
              </div>
              <div className={iconContainerInfo}>
                <House className={`${iconClass} text-forest-green-700`} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Your accommodation</p>
            </div>
          </CardContent>
        </Card>

        {/* Current Hostel Card - Teal theme */}
        <Card className={floatingCard}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={labelClass}>Current Hostel</p>
                <p className={`${valueClass} mt-2 text-teal-700`}>
                  {hostelName}
                </p>
              </div>
              <div className={iconContainerTeal}>
                <Building2 className={`${iconClass} text-teal-600`} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Your location</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin/SuperAdmin cards (original logic with enhanced styling)
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className={floatingCard}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <div className={iconContainer}>
            <Banknote className={`${iconClass} text-emerald-600`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">GH₵{(analyticsData?.totalRevenue || 0).toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">of GH₵{(analyticsData?.expectedIncome || 0).toFixed(2)} expected</p>
          <div className="mt-3">
            <Progress
              value={analyticsData?.expectedIncome > 0 ? (analyticsData?.totalRevenue / analyticsData?.expectedIncome) * 100 : 0}
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      <Card className={floatingCard}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <div className={iconContainerInfo}>
            <Percent className={`${iconClass} text-forest-green-700`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsData && analyticsData?.occupancyRate?.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {analyticsData && analyticsData?.occupiedRooms} of {analyticsData && analyticsData?.activeRooms} rooms occupied
          </p>
          <div className="mt-3">
            <Progress
              value={analyticsData && analyticsData.occupancyRate}
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {analyticsData?.totalHostels > -1 && (
        <Card className={floatingCard}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <div className={iconContainerWarning}>
              <Banknote className={`${iconClass} text-amber-600`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GH₵{(analyticsData?.totalDebt || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">of GH₵{(analyticsData?.currentYearStats?.expectedRevenue || 0).toFixed(2)} expected</p>
            <div className="mt-3">
              <Progress
                value={analyticsData?.currentYearStats?.expectedRevenue > 0 ? (analyticsData?.totalDebt / analyticsData?.currentYearStats?.expectedRevenue) * 100 : 0}
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {analyticsData?.totalStaff > -1 && (
        <Card className={floatingCard}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <div className={iconContainerTeal}>
              <Users className={`${iconClass} text-teal-600`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{analyticsData && analyticsData.totalStaff || 0}</div>
          </CardContent>
        </Card>
      )}

      <Card className={floatingCard}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
          <div className={iconContainer}>
            <Users className={`${iconClass} text-emerald-600`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{analyticsData && analyticsData.totalResidents}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsCard
