import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@radix-ui/react-progress'
import { Analytics } from '@/helper/types/types'

type analyticsData = Analytics
const PaymentStat = ({ analyticsData }: { analyticsData: analyticsData }) => {
  return (
    <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Payment Statistics</CardTitle>
                <CardDescription className="text-gray-500">Overview of payment and debt information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Total Payments</div>
                      <div className="text-2xl font-bold">{ analyticsData && analyticsData.totalPayments}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Average Payment</div>
                      <div className="text-2xl font-bold">GH₵{ analyticsData && analyticsData.averagePaymentAmount.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Total Debt</div>
                      <div className="text-2xl font-bold">GH₵{analyticsData && analyticsData.totalDebt.toFixed(2)}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Debt Percentage</div>
                      <div className="text-2xl font-bold">{analyticsData && analyticsData.debtPercentage.toFixed(2)}%</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="text-sm font-medium">Debt Status</div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div>Debt-free Residents</div>
                        <div>
                          {analyticsData && analyticsData?.totalResidents - analyticsData?.totalDebtors} of {analyticsData && analyticsData?.totalResidents}
                        </div>
                      </div>
                      <Progress
                        value={
                          (analyticsData && (analyticsData.totalResidents - analyticsData.totalDebtors) / analyticsData.totalResidents) *
                          100
                        }
                        className="mt-1 bg-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
  )
}

export default PaymentStat