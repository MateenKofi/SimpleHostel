import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { COLORS } from '@/helper/chartColors'
import { ResponsiveContainer, Pie, Cell, Tooltip,PieChart } from 'recharts'
import { Analytics } from '@/helper/types/types'

type analyticsData = Analytics
const OccupancyStatus = ({ analyticsData }: { analyticsData: analyticsData }) => {
  const occupancyData = [
    { name: "Occupied", value: analyticsData?.occupiedRooms || 0 },
    { name: "Vacant", value: analyticsData?.activeRooms - analyticsData?.occupiedRooms || 0 },
  ]

  return (
     <Card className="lg:col-span-3 border-gray-200">
              <CardHeader>
                <CardTitle>Occupancy Status</CardTitle>
                <CardDescription className="text-gray-500">Current room occupancy breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {occupancyData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Total Rooms</div>
                    <div className="text-lg font-bold">{analyticsData && analyticsData.totalRooms}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Active Rooms</div>
                    <div className="text-lg font-bold">{analyticsData && analyticsData.activeRooms}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
  )
}

export default OccupancyStatus