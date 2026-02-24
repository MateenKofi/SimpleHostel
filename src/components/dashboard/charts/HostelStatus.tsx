import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { COLORS } from "@/helper/chartColors"
import { ResponsiveContainer, Pie, Cell, Tooltip, PieChart } from "recharts"
import { Analytics } from '@/helper/types/types'
import AnimatedValue from '../AnimatedValue'

type analyticsData = Analytics

const HostelStatus = ({ analyticsData }: { analyticsData: analyticsData }) => {
  const published = analyticsData?.publishedHostels || 0
  const verified = analyticsData?.verifiedHostels || 0
  const verifiedButNotPublished = Math.max(0, verified - published)
  const unverified = analyticsData?.unverifiedHostels || 0

  const hostelStatusData = [
    { name: "Published", value: published },
    { name: "Verified (Unpublished)", value: verifiedButNotPublished },
    { name: "Unverified", value: unverified },
  ]

  const totalHostels = published + verifiedButNotPublished + unverified

  return (
    <Card className="border-border/80 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Hostel Status</CardTitle>
        <CardDescription className="text-muted-foreground mt-1">
          Overview of hostel verification and publication status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={hostelStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                label={({ name, percent }) => {
                  const shortName = name === "Verified (Unpublished)" ? "Verified" : name;
                  return `${shortName}: ${(percent * 100).toFixed(0)}%`;
                }}
              >
                {hostelStatusData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number, name: string) => [value, name === "Verified (Unpublished)" ? "Verified" : name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center Label */}
        <div className="mt-[-150px] flex flex-col items-center justify-center pointer-events-none">
          <div className="text-2xl md:text-3xl font-bold text-foreground">
            <AnimatedValue value={totalHostels} format="number" duration={600} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Total Hostels</div>
        </div>

        {/* Modern Legend with Stats */}
        <div className="mt-12 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: COLORS[0] }}
              ></div>
              <span className="text-xs font-medium text-muted-foreground">Published</span>
            </div>
            <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
              <AnimatedValue value={published} format="number" duration={400} />
            </div>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-sage-green-50/50 dark:bg-sage-green-950/20">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: COLORS[1] }}
              ></div>
              <span className="text-xs font-medium text-muted-foreground text-center leading-tight">
                Verified<br/>(Unpublished)
              </span>
            </div>
            <div className="text-xl font-bold text-sage-green-700 dark:text-sage-green-400">
              <AnimatedValue value={verifiedButNotPublished} format="number" duration={400} />
            </div>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-warm-gray-100/50 dark:bg-warm-gray-900/20">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: COLORS[2] }}
              ></div>
              <span className="text-xs font-medium text-muted-foreground">Unverified</span>
            </div>
            <div className="text-xl font-bold text-warm-gray-700 dark:text-warm-gray-400">
              <AnimatedValue value={unverified} format="number" duration={400} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HostelStatus
