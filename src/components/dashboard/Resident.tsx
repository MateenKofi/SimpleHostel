import { useQuery } from "@tanstack/react-query"
import { getResidentAnalytics } from "@/api/analytics"
import { DashboardLoading } from "../loaders/DashboardLoader"
import PaymentTrend from "./charts/PaymentTrend"
import AnalyticsCard from "./AnalyticsCard"
import ResidentQuickActions from "./ResidentQuickActions"
import UpcomingDeadlines from "./UpcomingDeadlines"
import { useAuthStore } from "@/stores/useAuthStore"
import { Sparkles } from "lucide-react"
import ModernDashboardBackground from "./ModernDashboardBackground"
import "./dashboard.css"

const Resident = () => {
  const user_id = localStorage.getItem('userId')
  const { user } = useAuthStore()

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics_resident"],
    queryFn: async () => {
      const responseData = await getResidentAnalytics(user_id!)
      return responseData?.data
    },
    enabled: !!user_id,
  })

  if (isLoading) {
    return <DashboardLoading />
  }

  const userName = user?.name || analyticsData?.name || 'Resident'
  const outstandingBalance = analyticsData?.totals?.outstandingBalance || 0
  const checkOutDate = analyticsData?.stay?.checkOutDate

  return (
    <ModernDashboardBackground>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <main className="flex-1 p-4 md:p-6 space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center gap-3 animate-fade-in-up">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  Welcome back, {userName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Here's what's happening with your account
                </p>
              </div>
            </div>

            {/* Analytics Cards - Stats Grid */}
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <AnalyticsCard analyticsData={analyticsData} />
            </div>

            {/* Quick Actions */}
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <ResidentQuickActions />
            </div>

            {/* Two Column Layout: Chart + Deadlines */}
            <div className="grid gap-6 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {/* Payment Trend Chart - Takes 2 columns */}
              <div className="lg:col-span-2">
                <PaymentTrend analyticsData={analyticsData} />
              </div>

              {/* Upcoming Deadlines - Takes 1 column */}
              <div>
                <UpcomingDeadlines
                  outstandingBalance={outstandingBalance}
                  checkOutDate={checkOutDate}
                />
              </div>
            </div>

          </main>
        </div>
      </div>
    </ModernDashboardBackground>
  )
}

export default Resident
