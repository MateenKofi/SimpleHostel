
import { CheckCircle, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface PaymentSuccessProps {
  amount?: string
  transactionId?: string
  onContinue?: () => void
  onDownloadReceipt?: () => void
}

const PaymentSuccess = ({
  amount = "$49.99",
  transactionId = "TXN-2024-001234",
  onContinue,
  onDownloadReceipt,
}: PaymentSuccessProps) => {
  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Payment Successful!</h1>
        <p className="text-muted-foreground">Your payment has been processed successfully</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-semibold text-foreground">{amount}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-sm text-foreground">{transactionId}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Status</span>
            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              Completed
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={onDownloadReceipt} variant="outline" className="w-full bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>

          <Button onClick={onContinue} className="w-full">
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          A confirmation email has been sent to your registered email address.
        </p>
      </CardContent>
    </Card>
  )
}
export default PaymentSuccess
