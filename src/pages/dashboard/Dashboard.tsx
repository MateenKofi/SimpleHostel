import React from 'react'
import { DollarSign, TrendingUp, MessageSquare,
  PlusCircle, RefreshCw, Clipboard, AlertTriangle, ThumbsUp
} from 'lucide-react'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import { StatCard } from "../../components/stat-card"
import  OccupancyCard  from "../../components/occupancy-card"



const Dashboard =()=> {
  return (
      <main className="flex-1 bg-white overflow-y-auto p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-3">
      <StatCard
        icon={DollarSign}
        title="Total Earning"
        content="242.65K"
        description="From last earning month"
        backgroundColor="bg-black"
        titleColor="text-white"
        contentColor="text-white"
        descriptionColor="text-white"
      />
      <StatCard
        icon={TrendingUp}
        title="Average Earning"
        content="17.347K"
        description="Daily Earning of this month"
        backgroundColor="bg-gray-100"
        titleColor="text-gray-600"
        contentColor="text-gray-900"
        descriptionColor="text-gray-600"
      />
      <StatCard
        icon={MessageSquare}
        title="Conversation Rate"
        content="74.86%"
        description="+6.04% greater than last month"
        backgroundColor="bg-gray-100"
        titleColor="text-gray-600"
        contentColor="text-gray-900"
        descriptionColor="text-gray-600"
      />
    </div>

    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto space-y-6">
        {/* Default colors */}
        <OccupancyCard
          data={{
            vacant: 49,
            occupied: 34,
            notReady: 8,
          }}
        />

       
      </div>
    </div>

       
      </main>
  )
}

export default Dashboard;