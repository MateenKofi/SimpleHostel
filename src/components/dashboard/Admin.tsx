import { useQuery } from "@tanstack/react-query";
import { getHostelAnalytics } from "@/api/analytics";
import { DashboardLoading } from "../loaders/DashboardLoader";
import RevenueOverView from "./charts/RevenueOverView";
import PaymentStat from "./charts/PaymentStat";
import OccupancyStatus from "./charts/OccupancyStatus";
import AnalyticsCard from "./AnalyticsCard";

const Admin = () => {
  const hostel_id = localStorage.getItem('hostelId')
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics_admin"],
    queryFn: async () => {
      const responseData = await getHostelAnalytics(hostel_id!);
      return responseData?.data;
    },
    enabled: !!hostel_id,
  });

  if (isLoading) {
    return <DashboardLoading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1">
        <main className="flex-1 p-4 md:p-2">
          <AnalyticsCard analyticsData={analyticsData} />

          <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-7">
            <RevenueOverView analyticsData={analyticsData} />
            <OccupancyStatus analyticsData={analyticsData} />
          </div>

          <div className="grid gap-4 mt-6">
            <PaymentStat analyticsData={analyticsData} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Admin