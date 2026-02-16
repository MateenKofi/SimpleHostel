import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, BarChart } from 'recharts'
import { CustomTooltip } from '@/helper/CutomToolTip'
import { CHART_COLORS } from '@/helper/chartColors'
import { Analytics } from '@/helper/types/types'
import BentoCard from '../BentoCard'
import AnimatedValue from '../AnimatedValue'
import TrendIndicator from '../TrendIndicator'

type analyticsData = Analytics

const RevenueOverView = ({ analyticsData }: { analyticsData: analyticsData }) => {
  const revenueBarData = [
    {
      name: "Revenue",
      Collected: analyticsData?.currentYearStats?.collectedRevenue,
      Expected: analyticsData?.currentYearStats?.expectedRevenue,
      Outstanding: analyticsData?.currentYearStats?.outstandingAmount,
    },
  ]

  return (
    <Card className="border-border/80 shadow-sm hover:shadow-md transition-shadow duration-300 lg:col-span-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Current year revenue collection status
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={60}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.2)' }} />
              <Bar dataKey="Collected" fill={CHART_COLORS.forest_light} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expected" fill={CHART_COLORS.sage} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Outstanding" fill={CHART_COLORS.forest_dark} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="text-sm font-medium text-muted-foreground mb-1">Collected</div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              GH₵<AnimatedValue value={analyticsData?.currentYearStats?.collectedRevenue ?? 0} format="currency" decimals={2} duration={600} />
            </div>
          </div>
          <div className="text-center p-3 rounded-xl bg-sage-green-50/50 dark:bg-sage-green-950/20">
            <div className="text-sm font-medium text-muted-foreground mb-1">Expected</div>
            <div className="text-lg font-bold text-sage-green-700 dark:text-sage-green-400">
              GH₵<AnimatedValue value={analyticsData?.currentYearStats?.expectedRevenue ?? 0} format="currency" decimals={2} duration={600} />
            </div>
          </div>
          <div className="text-center p-3 rounded-xl bg-forest-green-50/50 dark:bg-forest-green-950/20">
            <div className="text-sm font-medium text-muted-foreground mb-1">Outstanding</div>
            <div className="text-lg font-bold text-forest-green-700 dark:text-forest-green-400">
              GH₵<AnimatedValue value={analyticsData?.currentYearStats?.outstandingAmount ?? 0} format="currency" decimals={2} duration={600} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RevenueOverView
