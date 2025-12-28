import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DashboardLoading } from "../loaders/DashboardLoader";
import PaymentTrend from "./charts/PaymentTrend";
import AnalyticsCard from "./AnalyticsCard";

const Resident = () => {
  const user_id = localStorage.getItem('userId')
   const { data: analyticsData, isLoading } = useQuery({
      queryKey: ["analytics_resident"],
      queryFn: async () => {
        const response = await axios.get(`/api/analytics/get/resident-dashboard/${user_id}`,{
          headers:{
             'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        return response.data?.data;
      },
    });
  
  if(isLoading){
    return <DashboardLoading/>
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