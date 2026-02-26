import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyTopUpPayment } from "@/api/payments";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Home,
  Download,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentVerificationData {
  reference: string;
  amount: number;
  status: string;
  paidAt: string;
  payment?: {
    id: string;
    amount: number;
    amountPaid: number;
    balanceOwed: number;
    status: string;
  };
}

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const reference = searchParams.get("reference");
  const status = searchParams.get("status"); // 'success' or 'failed'

  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentVerificationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setError("No payment reference found.");
        setIsVerifying(false);
        return;
      }

      try {
        const result = await verifyTopUpPayment(reference);
        if (result.data) {
          setPaymentData(result.data);
        }
      } catch (err: unknown) {
        console.error("Payment verification error:", err);
        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        setError(errorObj.response?.data?.message || errorObj.message || "Failed to verify payment");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [reference]);

  const isSuccess = status === "success" || paymentData?.status === "success";
  const amount = paymentData?.amount ? paymentData.amount / 100 : 0; // Paystack returns amount in kobo

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Verifying Payment</h2>
              <p className="text-muted-foreground mt-2">
                Please wait while we confirm your payment...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || (!isSuccess && status === "failed")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              {error || "Your payment could not be processed. Please try again."}
            </p>
            {reference && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Reference</p>
                <p className="font-mono text-sm">{reference}</p>
              </div>
            )}
            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
                Try Again
              </Button>
              <Button onClick={() => navigate("/dashboard/payment-billing")} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Back to Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Your payment has been successfully processed.
          </p>

          {paymentData && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-lg">GH₵{amount.toFixed(2)}</span>
                </div>
                {paymentData.payment && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Paid</span>
                      <span className="font-semibold">GH₵{(paymentData.payment.amountPaid || 0).toFixed(2)}</span>
                    </div>
                    {paymentData.payment.balanceOwed !== null && paymentData.payment.balanceOwed !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Balance Remaining</span>
                        <span className={`font-semibold ${paymentData.payment.balanceOwed > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          GH₵{paymentData.payment.balanceOwed.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Reference</span>
                  <span className="font-mono text-xs">{reference}</span>
                </div>
              </div>

              <Badge variant={paymentData.payment?.balanceOwed === 0 ? "default" : "secondary"} className="w-full justify-center py-2">
                {paymentData.payment?.balanceOwed === 0 ? "Fully Paid" : "Partial Payment"}
              </Badge>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => {
              // Invalidate billing queries to fetch fresh data
              queryClient.invalidateQueries({ queryKey: ['resident-billing'] });
              queryClient.invalidateQueries({ queryKey: ['receipt'] });
              navigate("/dashboard/payment-billing");
            }} className="w-full">
              <Receipt className="w-4 h-4 mr-2" />
              View Billing History
            </Button>
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResult;
