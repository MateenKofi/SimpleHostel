import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@radix-ui/react-progress'
import { Analytics } from '@/helper/types/types'

type analyticsData = Analytics
const PaymentStat = ({ analyticsData }: { analyticsData?: analyticsData }) => {
  const totalPayments = analyticsData?.totalPayments ?? 0;
  const averagePaymentAmount = analyticsData?.averagePaymentAmount ?? 0;
  const totalDebt = analyticsData?.totalDebt ?? 0;
  const debtPercentage = analyticsData?.debtPercentage ?? 0;
  const totalResidents = analyticsData?.totalResidents ?? 0;
  const totalDebtors = analyticsData?.totalDebtors ?? 0;
  const debtFreeResidents = totalResidents - totalDebtors;
  const debtFreePercentage = totalResidents > 0 ? (debtFreeResidents / totalResidents) * 100 : 0;

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
              <div className="text-2xl font-bold">{totalPayments}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Average Payment</div>
              <div className="text-2xl font-bold">GH₵{averagePaymentAmount.toFixed(2)}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Total Debt</div>
              <div className="text-2xl font-bold">GH₵{totalDebt.toFixed(2)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Debt Percentage</div>
              <div className="text-2xl font-bold">{debtPercentage.toFixed(2)}%</div>
            </div>
          </div>
          <div className="pt-4">
            <div className="text-sm font-medium">Debt Status</div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs">
                <div>Debt-free Residents</div>
                <div>
                  {debtFreeResidents} of {totalResidents}
                </div>
              </div>
              <Progress
                value={debtFreePercentage}
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