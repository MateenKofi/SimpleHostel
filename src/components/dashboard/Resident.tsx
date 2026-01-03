import { useQuery } from "@tanstack/react-query";
import { getResidentAnalytics } from "@/api/analytics";
import { DashboardLoading } from "../loaders/DashboardLoader";
import PaymentTrend from "./charts/PaymentTrend";
import AnalyticsCard from "./AnalyticsCard";

const Resident = () => {
  const user_id = localStorage.getItem('userId')
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics_resident"],
    queryFn: async () => {
      const responseData = await getResidentAnalytics(user_id!);
      return responseData?.data;
    },
    enabled: !!user_id,
  });

  if (isLoading) {
    return <DashboardLoading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1">
        <main className="flex-1 p-4 md:p-2">
          <AnalyticsCard analyticsData={analyticsData} />

          <div className="mt-6">
            <PaymentTrend analyticsData={analyticsData} />
          </div>

        </main>
      </div>
    </div>
  )
}

export default Resident