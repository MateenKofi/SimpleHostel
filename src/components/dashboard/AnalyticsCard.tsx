import { Progress } from '@/components/ui/progress'
import { Banknote, Percent, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Analytics } from '@/helper/types/types'

type analyticsData = Analytics
const AnalyticsCard = ({ analyticsData }: { analyticsData: analyticsData }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <Banknote className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">GH₵{analyticsData && analyticsData?.totalRevenue?.toFixed(2)}</div>
                <p className="text-xs text-gray-500">of GH₵{analyticsData && analyticsData.expectedIncome?.toFixed(2)} expected</p>
                <div className="mt-3">
                  <Progress
                    value={(analyticsData?.totalRevenue / analyticsData?.expectedIncome) * 100}
                    className="bg-gray-200"
                  
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <Percent className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ analyticsData && analyticsData?.occupancyRate?.toFixed(1)}%</div>
                <p className="text-xs text-gray-500">
                  {analyticsData && analyticsData?.occupiedRooms} of {analyticsData && analyticsData?.activeRooms} rooms occupied
                </p>
                <div className="mt-3">
                  <Progress
                    value={ analyticsData &&analyticsData.occupancyRate}
                    className="bg-gray-200"
                  
                  />
                </div>
              </CardContent>
            </Card>
            {analyticsData?.totalHostels > -1 && (
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
                  <Banknote className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">GH₵{analyticsData && analyticsData?.totalDebt?.toFixed(2)}</div>
                  <p className="text-xs text-gray-500">of GH₵{analyticsData && analyticsData?.currentYearStats?.expectedRevenue?.toFixed(2)} expected</p>
                  <div className="mt-3">
                    <Progress
                      value={(analyticsData?.totalDebt / analyticsData?.currentYearStats?.expectedRevenue) * 100}
                      className="bg-gray-200"
                    
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            {analyticsData?.totalStaff > -1 && (
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-end justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{analyticsData && analyticsData.totalStaff || 0}</div>
                </CardContent>
              </Card>
            )}
          
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{analyticsData && analyticsData.totalResidents}</div>
              </CardContent>
            </Card>
          </div>
  )
}

export default AnalyticsCard