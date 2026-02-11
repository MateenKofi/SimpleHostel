import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, BarChart } from 'recharts'
import { CustomTooltip } from '@/helper/CutomToolTip'
import { Analytics } from '@/helper/types/types'
import { TrendingUp } from 'lucide-react'

type analyticsData = Analytics

const floatingCard = "bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50"

interface BarProps {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
}

// Custom gradient bar component
const GradientBar = (props: BarProps) => {
  const { x, y, width, height, index = 0 } = props
  return (
    <g>
      <defs>
        <linearGradient id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b2b26" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#0b2b26" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#barGradient-${index})`}
        rx={4}
        ry={4}
      />
    </g>
  )
}

const PaymentTrend = ({ analyticsData }: { analyticsData: analyticsData }) => {
  // Use paymentTrend array from resident data, fallback to empty array if not present
  const trendData = analyticsData?.paymentTrend || []

  const totalPayments = trendData.reduce(
    (sum: number, item: { value?: number }) => sum + (item.value || 0),
    0
  )

  // Calculate average payment
  const avgPayment = trendData.length > 0
    ? totalPayments / trendData.length
    : 0

  // Find highest payment month
  const highestPayment = trendData.length > 0
    ? Math.max(...trendData.map((item: { value?: number }) => item.value || 0))
    : 0

  return (
    <Card className={floatingCard}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Payment Trend</CardTitle>
            <CardDescription className="text-gray-500 mt-0.5">
              Monthly payment history over the last 6 months
            </CardDescription>
          </div>
          {trendData.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                GH₵{totalPayments.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {trendData.length > 0 ? (
          <>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  barSize={32}
                >
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `GH₵${value}`}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#0b2b26"
                    radius={[6, 6, 0, 0]}
                    shape={<GradientBar />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Total (6 months)</p>
                <p className="text-sm font-bold text-gray-900">GH₵{totalPayments.toFixed(2)}</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Average</p>
                <p className="text-sm font-bold text-gray-900">GH₵{avgPayment.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Highest</p>
                <p className="text-sm font-bold text-gray-900">GH₵{highestPayment.toFixed(2)}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="h-[260px] flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-gray-50 mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <p className="font-medium text-gray-900">No payment data yet</p>
            <p className="text-sm text-gray-500 mt-1">Your payment history will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PaymentTrend
