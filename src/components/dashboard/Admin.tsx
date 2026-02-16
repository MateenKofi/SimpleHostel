import { useQuery } from "@tanstack/react-query";
import { getHostelAnalytics } from "@/api/analytics";
import { DashboardLoading } from "../loaders/DashboardLoader";
import RevenueOverView from "./charts/RevenueOverView";
import PaymentStat from "./charts/PaymentStat";
import OccupancyStatus from "./charts/OccupancyStatus";
import AnalyticsCard from "./AnalyticsCard";
import ModernDashboardBackground from "./ModernDashboardBackground";
import "./dashboard.css";

const Admin = () => {
  const hostel_id = localStorage.getItem('hostelId')
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics_admin"],
    queryFn: async () => {
      const responseData = await getHostelAnalytics(hostel_id!);
      return responseData?.json || responseData?.data || responseData;
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
            {/* Analytics Cards - Modern Bento Grid */}
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
          </main>
        </div>
      </div>
    </ModernDashboardBackground>
  )
}

export default Admin
