import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarClock, Users, BadgeCent, Building2, PieChart } from "lucide-react"
import moment from "moment"
import { CalendarYearT } from "@/helper/types/types"

const CurrentYearCard = ({ currentYear }: { currentYear: CalendarYearT | undefined }) => {
  if (!currentYear) return <p className="text-center shadow-md border rounded-md p-6 my-4 h-48">No current calendar year found.</p>

  const metrics = currentYear?.metrics;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarClock className="mr-2 h-5 w-5" />
          Current Calendar Year: <p className="ml-2 ">{currentYear?.name}</p>
        </CardTitle>
        <CardDescription>
          {currentYear?.isActive
            ? "Active calendar year details and financial summary"
            : "This calendar year has ended"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Started on:{" "}
              {currentYear?.startDate
                ? moment(currentYear?.startDate).format("dddd, MMMM Do YYYY, h:mm:ss a")
                : "No start date"}
            </p>
            <p className="text-sm text-muted-foreground">
              Ended on: {currentYear?.endDate ? moment(currentYear?.endDate).format("MM/DD/YYYY") : "No end date"}
            </p>
          </div>

          {/* Current Year Metrics */}
          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {/* Residents - Current year only */}
              <div className="bg-forest-green-50 dark:bg-forest-green-950/20 border border-forest-green-200 dark:border-forest-green-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-forest-green-700 dark:text-forest-green-400" />
                  <span className="text-sm font-medium text-muted-foreground">Residents</span>
                </div>
                <p className="text-2xl font-bold text-forest-green-700 dark:text-forest-green-400">
                  {metrics.residentsCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Current year</p>
              </div>

              {/* Total Revenue - Current year only */}
              <div className="bg-teal-green-50 dark:bg-teal-green-950/20 border border-teal-green-200 dark:border-teal-green-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCent className="h-5 w-5 text-teal-green-700 dark:text-teal-green-400" />
                  <span className="text-sm font-medium text-muted-foreground">Revenue</span>
                </div>
                <p className="text-2xl font-bold text-teal-green-700 dark:text-teal-green-400">
                  GHS{(metrics.totalRevenue / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-muted-foreground mt-1">Current year</p>
              </div>

              {/* Occupancy Rate - Current year only */}
              <div className="bg-forest-green-50 dark:bg-forest-green-950/20 border border-forest-green-200 dark:border-forest-green-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-5 w-5 text-forest-green-700 dark:text-forest-green-400" />
                  <span className="text-sm font-medium text-muted-foreground">Occupancy</span>
                </div>
                <p className="text-2xl font-bold text-forest-green-700 dark:text-forest-green-400">
                  {metrics.occupancyRate}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Of {metrics.totalRooms} rooms</p>
              </div>

              {/* Total Rooms - Current year only */}
              <div className="bg-warm-gray-100 dark:bg-warm-gray-800/20 border border-warm-gray-200 dark:border-warm-gray-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-warm-gray-700 dark:text-warm-gray-400" />
                  <span className="text-sm font-medium text-muted-foreground">Total Rooms</span>
                </div>
                <p className="text-2xl font-bold text-warm-gray-700 dark:text-warm-gray-400">
                  {metrics.totalRooms}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Current capacity</p>
              </div>
            </div>
          )}

          {/* Total Years - Historical data */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total Calendar Years: <span className="font-semibold text-foreground">{metrics?.totalYears ?? 0}</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrentYearCard