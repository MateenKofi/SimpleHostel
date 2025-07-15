import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Bar,BarChart } from 'recharts'
import { CustomTooltip } from '@/helper/CutomToolTip'
import { CHART_COLORS } from '@/helper/chartColors'
import { Analytics } from '@/helper/types/types'


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
     <Card className="border-gray-200 lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription className="text-gray-500">Current year revenue collection status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Collected" fill={CHART_COLORS.green} />
                      <Bar dataKey="Expected" fill={CHART_COLORS.yellow} />
                      <Bar dataKey="Outstanding" fill={CHART_COLORS.blue_black} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Collected</div>
                    <div className="text-lg font-bold">
                      GH₵{(analyticsData?.currentYearStats?.collectedRevenue ?? 0).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Expected</div>
                    <div className="text-lg font-bold">
                      GH₵{(analyticsData?.currentYearStats?.expectedRevenue ?? 0).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Outstanding</div>
                    <div className="text-lg font-bold">
                      GH₵{(analyticsData?.currentYearStats?.outstandingAmount ?? 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
  )
}

export default RevenueOverView