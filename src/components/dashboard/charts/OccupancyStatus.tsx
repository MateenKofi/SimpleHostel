import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { COLORS } from '@/helper/chartColors'
import { ResponsiveContainer, Pie, Cell, Tooltip, PieChart } from 'recharts'
import { Analytics } from '@/helper/types/types'
import AnimatedValue from '../AnimatedValue'

type analyticsData = Analytics

const OccupancyStatus = ({ analyticsData }: { analyticsData: analyticsData }) => {
  const occupiedRooms = analyticsData?.occupiedRooms || 0
  const activeRooms = analyticsData?.activeRooms || 0
  const vacantRooms = Math.max(0, activeRooms - occupiedRooms)
  // Use backend's occupancyRate directly for accuracy
  const occupancyPercentage = analyticsData?.occupancyRate ?? 0

  const occupancyData = [
    { name: "Occupied", value: occupiedRooms },
    { name: "Vacant", value: vacantRooms },
  ]

  return (
    <Card className="border-border/80 shadow-sm hover:shadow-md transition-shadow duration-300 lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Occupancy Status</CardTitle>
        <CardDescription className="text-muted-foreground mt-1">
          Current room occupancy breakdown
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[280px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={occupancyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {occupancyData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center Label for Donut */}
        <div className="mt-[-180px] flex flex-col items-center justify-center pointer-events-none">
          <div className="text-3xl md:text-4xl font-bold text-foreground">
            <AnimatedValue value={occupancyPercentage} format="number" decimals={1} duration={800} />%
          </div>
          <div className="text-sm text-muted-foreground mt-1">Occupancy</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-16">
          <div className="text-center p-3 rounded-xl bg-forest-green-50/50 dark:bg-forest-green-950/20">
            <div className="text-sm font-medium text-muted-foreground mb-1">Occupied</div>
            <div className="text-lg font-bold text-forest-green-700 dark:text-forest-green-400">
              <AnimatedValue value={occupiedRooms} format="number" duration={500} />
            </div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <div className="text-sm font-medium text-muted-foreground mb-1">Total Rooms</div>
            <div className="text-lg font-bold text-foreground">
              <AnimatedValue value={analyticsData?.totalRooms ?? 0} format="number" duration={500} />
            </div>
          </div>
          <div className="text-center p-3 rounded-xl bg-sage-green-50/50 dark:bg-sage-green-950/20">
            <div className="text-sm font-medium text-muted-foreground mb-1">Active Rooms</div>
            <div className="text-lg font-bold text-sage-green-700 dark:text-sage-green-400">
              <AnimatedValue value={activeRooms} format="number" duration={500} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OccupancyStatus
