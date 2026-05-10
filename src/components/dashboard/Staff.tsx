import { useQuery } from "@tanstack/react-query";
import { getHostelAnalytics } from "@/api/analytics";
import { DashboardLoading } from "../loaders/DashboardLoader";
import RevenueOverView from "./charts/RevenueOverView";
import PaymentStat from "./charts/PaymentStat";
import OccupancyStatus from "./charts/OccupancyStatus";
import AnalyticsCard from "./AnalyticsCard";
import ModernDashboardBackground from "./ModernDashboardBackground";
import "./dashboard.css";

const Staff = () => {
  const hostel_id = localStorage.getItem('hostelId')
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics_staff"],
    queryFn: async () => {
      const responseData = await getHostelAnalytics(hostel_id!);
      return responseData?.data || responseData;
    },
    enabled: !!hostel_id,
  });

  if (isLoading) {
    return <DashboardLoading />
  }

  return (
    <ModernDashboardBackground>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <main className="flex-1 p-4 md:p-2">
            {/* Header - Staff specific */}
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Staff Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                View hostel analytics and manage daily operations
              </p>
            </div>

            {/* Analytics Cards - Read Only View */}
            <AnalyticsCard analyticsData={analyticsData} />

            {/* Charts Row - Revenue and Occupancy */}
            <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-7">
              <RevenueOverView analyticsData={analyticsData} />
              <OccupancyStatus analyticsData={analyticsData} />
            </div>

            {/* Payment Statistics */}
            <div className="grid gap-4 mt-6">
              <PaymentStat analyticsData={analyticsData} />
            </div>

            {/* Quick Info Box */}
            <div className="mt-6 p-4 bg-forest-green-50 rounded-lg border border-forest-green-100">
              <p className="text-sm text-forest-green-700">
                <strong>Note:</strong> This is a read-only view. Contact your administrator if you need to make changes.
              </p>
            </div>
          </main>
        </div>
      </div>
    </ModernDashboardBackground>
  )
};

export default Staff