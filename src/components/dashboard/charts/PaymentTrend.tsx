import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, BarChart } from 'recharts'
import { CustomTooltip } from '@/helper/CutomToolTip'
import { CHART_COLORS } from '@/helper/chartColors'
import { Analytics } from '@/helper/types/types'

type analyticsData = Analytics

const PaymentTrend = ({ analyticsData }: { analyticsData: analyticsData }) => {
  // Use paymentTrend array from resident data, fallback to empty array if not present
  const trendData = analyticsData?.paymentTrend || []

  return (
    <Card className="border-gray-200 lg:col-span-4">
      <CardHeader>
        <CardTitle>Payment Trend</CardTitle>
        <CardDescription className="text-gray-500">Monthly payment history over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={CHART_COLORS.green} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {trendData.length > 0 && (
          <div className="mt-4 text-center">
            <div className="text-sm font-medium text-gray-500">Total Payments (6 months)</div>
            <div className="text-lg font-bold">
              GH₵{trendData.reduce((sum: number, item: { value?: number }) => sum + (item.value || 0), 0).toFixed(2)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PaymentTrend
