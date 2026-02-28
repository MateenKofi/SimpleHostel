import { useNavigate, useSearchParams } from "react-router-dom"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getPaymentByRef } from "@/api/payments"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Copy, Home, ChevronLeft } from "lucide-react"
import { toast } from "sonner"

const CashPaymentConfirmation = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const reference = searchParams.get("reference")

  const { data: payment, isLoading } = useQuery({
    queryKey: ["payment", reference],
    queryFn: async () => {
      const res = await getPaymentByRef(reference!)
      return res.data
    },
    enabled: !!reference,
  })

  const copyReference = () => {
    if (reference) {
      navigator.clipboard.writeText(reference)
      toast.success("Reference copied to clipboard")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-muted/50 px-4">
        <p className="text-muted-foreground">Payment not found</p>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-muted/50">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-transparent hover:text-primary -ml-3"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <Card className="overflow-hidden shadow-sm">
          <CardContent className="p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Cash Payment Initiated</h1>
              <p className="text-muted-foreground mt-2">
                Please proceed to the front desk to complete your payment
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-muted p-6 rounded-xl space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount to Pay</span>
                <span className="text-2xl font-bold text-foreground">
                  GH₵{payment.amount?.toLocaleString() || "0"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <span className="font-semibold text-foreground capitalize">Cash</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                  Pending Confirmation
                </span>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Reference Number</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-background rounded-md text-sm font-mono border border-border">
                    {reference}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyReference}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Show this reference to the staff when making payment
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3 mb-8">
              <h3 className="font-semibold text-foreground">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Visit the front desk with your reference number</li>
                <li>Make the cash payment to the staff</li>
                <li>Staff will confirm your payment</li>
                <li>You'll receive your access code via email once confirmed</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/dashboard")}
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate("/dashboard/payment-billing")}
              >
                View Payments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your room will be reserved once the cash payment is confirmed by our staff.
            Please keep your reference number safe for quick processing.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CashPaymentConfirmation
