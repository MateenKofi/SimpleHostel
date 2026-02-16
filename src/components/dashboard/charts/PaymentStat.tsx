import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@radix-ui/react-progress'
import { Analytics } from '@/helper/types/types'
import AnimatedValue from '../AnimatedValue'
import TrendIndicator from '../TrendIndicator'

type analyticsData = Analytics

const PaymentStat = ({ analyticsData }: { analyticsData?: analyticsData }) => {
  const totalPayments = analyticsData?.totalPayments ?? 0
  const averagePaymentAmount = analyticsData?.averagePaymentAmount ?? 0
  const totalDebt = analyticsData?.totalDebt ?? 0
  const debtPercentage = analyticsData?.debtPercentage ?? 0
  const totalResidents = analyticsData?.totalResidents ?? 0
  const totalDebtors = analyticsData?.totalDebtors ?? 0
  const debtFreeResidents = totalResidents - totalDebtors
  const debtFreePercentage = totalResidents > 0 ? (debtFreeResidents / totalResidents) * 100 : 0

  return (
    <Card className="border-border/80 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Payment Statistics</CardTitle>
        <CardDescription className="text-muted-foreground mt-1">
          Overview of payment and debt information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* First Row - Total Payments & Average Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30">
              <div className="text-sm font-medium text-muted-foreground mb-2">Total Payments</div>
              <div className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                <AnimatedValue value={totalPayments} format="number" duration={600} />
              </div>
              <div className="mt-2">
                <TrendIndicator value={8.2} label="vs last month" direction="up" showIcon={false} className="text-[10px]" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100/50 dark:border-teal-900/30">
              <div className="text-sm font-medium text-muted-foreground mb-2">Average Payment</div>
              <div className="text-lg md:text-xl font-bold text-teal-700 dark:text-teal-400">
                GH₵<AnimatedValue value={averagePaymentAmount} format="currency" decimals={2} duration={600} />
              </div>
              <div className="mt-2">
                <TrendIndicator value={3.5} label="vs last month" direction="up" showIcon={false} className="text-[10px]" />
              </div>
            </div>
          </div>

          {/* Second Row - Total Debt & Debt Percentage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30">
              <div className="text-sm font-medium text-muted-foreground mb-2">Total Debt</div>
              <div className="text-lg md:text-xl font-bold text-amber-700 dark:text-amber-400">
                GH₵<AnimatedValue value={totalDebt} format="currency" decimals={2} duration={600} />
              </div>
              <div className="mt-2">
                <TrendIndicator value={-5.2} label="vs last month" direction="down" showIcon={false} className="text-[10px]" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-warm-red-50/50 dark:bg-warm-red-950/20 border border-warm-red-100/50 dark:border-warm-red-900/30">
              <div className="text-sm font-medium text-muted-foreground mb-2">Debt Percentage</div>
              <div className="text-lg md:text-xl font-bold text-warm-red-700 dark:text-warm-red-400">
                <AnimatedValue value={debtPercentage} format="number" decimals={2} duration={600} />%
              </div>
              <div className="mt-2">
                <TrendIndicator value={-2.1} label="vs last month" direction="down" showIcon={false} className="text-[10px]" />
              </div>
            </div>
          </div>

          {/* Debt Status Progress */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-foreground">Debt-free Residents</div>
              <div className="text-sm text-muted-foreground">
                <AnimatedValue value={debtFreeResidents} format="number" duration={400} /> of {totalResidents}
              </div>
            </div>
            <Progress
              value={debtFreePercentage}
              className="h-3 bg-muted/50"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{debtFreePercentage.toFixed(1)}% debt-free</span>
              <TrendIndicator value={debtFreePercentage} label="healthy" direction="up" showIcon={false} className="text-[10px]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentStat
