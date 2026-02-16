import AnalyticsCard from "./AnalyticsCard";
import RevenueOverView from "./charts/RevenueOverView";
import { useQuery } from "@tanstack/react-query";
import { getSystemAnalytics } from "@/api/analytics";
import HostelStatus from "./charts/HostelStatus";
import PaymentStat from "./charts/PaymentStat";
import SystemOverviewTable from "./SystemOverviewTable";
import OccupancyStatus from "./charts/OccupancyStatus";
import { DashboardLoading } from "../loaders/DashboardLoader";
import ModernDashboardBackground from "./ModernDashboardBackground";
import "./dashboard.css";

const SuperAdmin = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics_super_admin"],
    queryFn: async () => {
      const responseData = await getSystemAnalytics();
      return responseData?.data;
    },
  });

  if (isLoading) {
    return <DashboardLoading />
  }

  return (
    <ModernDashboardBackground>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <main className="flex-1 p-4 md:p-6">
            {/* Analytics Cards - Modern Bento Grid */}
            <AnalyticsCard analyticsData={analyticsData} />

            {/* Charts Row - Revenue and Occupancy */}
            <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-7">
              <RevenueOverView analyticsData={analyticsData} />
              <OccupancyStatus analyticsData={analyticsData} />
            </div>

            {/* Hostel Status and Payment Stats */}
            <div className="grid gap-4 mt-6 md:grid-cols-2">
              <HostelStatus analyticsData={analyticsData} />
              <PaymentStat analyticsData={analyticsData} />
            </div>

            {/* System Overview Table */}
            <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <SystemOverviewTable analyticsData={analyticsData} />
            </div>
          </main>
        </div>
      </div>
    </ModernDashboardBackground>
  );
};

export default SuperAdmin;
