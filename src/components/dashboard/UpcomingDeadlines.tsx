import { Card, CardContent } from '@/components/ui/card'
import { Calendar, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'

const floatingCard = "bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50"

interface UpcomingDeadlinesProps {
  outstandingBalance?: number
  nextPaymentDate?: string
  checkOutDate?: string
}

const UpcomingDeadlines = ({ outstandingBalance = 0, nextPaymentDate, checkOutDate }: UpcomingDeadlinesProps) => {
  // Calculate days until next payment due
  const getDaysUntilDue = (dateString?: string) => {
    if (!dateString) return null
    try {
      const dueDate = parseISO(dateString)
      const today = new Date()
      const days = differenceInDays(dueDate, today)
      return days
    } catch {
      return null
    }
  }

  const daysUntilPayment = getDaysUntilDue(nextPaymentDate)
  const daysUntilCheckout = getDaysUntilDue(checkOutDate)

  // Get urgency level for payment
  const getPaymentUrgency = () => {
    if (outstandingBalance <= 0) {
      return {
        level: 'none',
        icon: CheckCircle,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        message: 'All payments up to date!',
      }
    }
    if (daysUntilPayment === null) {
      return {
        level: 'info',
        icon: Clock,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        message: 'No due date set',
      }
    }
    if (daysUntilPayment < 0) {
      return {
        level: 'overdue',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        message: `${Math.abs(daysUntilPayment)} days overdue`,
      }
    }
    if (daysUntilPayment <= 3) {
      return {
        level: 'urgent',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        message: `Due in ${daysUntilPayment} day${daysUntilPayment !== 1 ? 's' : ''}`,
      }
    }
    if (daysUntilPayment <= 7) {
      return {
        level: 'warning',
        icon: AlertCircle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        message: `Due in ${daysUntilPayment} days`,
      }
    }
    return {
      level: 'normal',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      message: `Due in ${daysUntilPayment} days`,
    }
  }

  const paymentUrgency = getPaymentUrgency()
  const PaymentIcon = paymentUrgency.icon

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      const date = parseISO(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return null
    }
  }

  return (
    <Card className={floatingCard}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            <p className="text-sm text-gray-500 mt-0.5">Important dates & reminders</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Payment Due Section */}
          <div className={`flex items-center gap-3 p-3 rounded-lg ${paymentUrgency.bgColor}`}>
            <div className={`p-2 rounded-lg bg-white/50`}>
              <PaymentIcon className={`h-5 w-5 ${paymentUrgency.color}`} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">Payment Due</p>
              <p className={`text-xs ${paymentUrgency.color} font-medium`}>
                {paymentUrgency.message}
              </p>
            </div>
            {outstandingBalance > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Balance</p>
                <p className="text-sm font-semibold text-gray-900">
                  GH₵{outstandingBalance.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Contract Renewal / Checkout Section */}
          {daysUntilCheckout !== null && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="p-2 rounded-lg bg-white/50">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">Stay Period</p>
                <p className="text-xs text-primary font-medium">
                  {daysUntilCheckout > 0
                    ? `${daysUntilCheckout} days remaining`
                    : daysUntilCheckout === 0
                      ? 'Last day today'
                      : 'Period ended'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">End Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(checkOutDate) || 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* No deadlines state */}
          {outstandingBalance <= 0 && !checkOutDate && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="p-3 rounded-full bg-emerald-50 mb-3">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="font-medium text-gray-900">All caught up!</p>
              <p className="text-sm text-gray-500">No upcoming deadlines</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default UpcomingDeadlines
