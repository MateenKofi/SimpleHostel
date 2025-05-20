import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
        const response = await axios.get(`/api/analytics/get/hostel/${hostel_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        return response.data?.data;
      },
    });
  
  if(isLoading){
    return <DashboardLoading/>
  }
  
  return (
      <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1">
        <main className="flex-1 p-4 md:p-6">
          <AnalyticsCard analyticsData={analyticsData} />

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <RevenueOverView analyticsData={analyticsData} />
            <OccupancyStatus analyticsData={analyticsData}/>
          </div>

          <div className="mt-6 grid gap-4">
            <PaymentStat analyticsData={analyticsData}/>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Admin