import { PaymentDto } from "@/types/dtos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, RefreshCw, X } from "lucide-react";
import { retryPayment, cancelPayment } from "@/api/payments";
import { toast } from "sonner";
import { useState } from "react";
import { getPaymentStatusBadgeVariant, getPaymentStatusLabel } from "@/utils";

interface PaymentHistoryProps {
  payments: PaymentDto[];
  onViewReceipt?: (reference: string) => void;
  onRefresh?: () => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments, onViewReceipt, onRefresh }) => {
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  const handleRetry = async (reference: string) => {
    if (processingPayment) return;
    setProcessingPayment(reference);

    try {
      const result = await retryPayment(reference);
      toast.success("Redirecting to payment...", {
        description: "Your payment session has been reinitialized.",
      });
      // Redirect to Paystack authorization URL
      window.location.href = result.authorizationUrl;
    } catch (error: unknown) {
      console.error("Retry payment error:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (error as { message?: string })?.message || "Failed to retry payment";
      toast.error("Retry Failed", { description: errorMessage });
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleCancel = async (reference: string) => {
    if (processingPayment) return;
    setProcessingPayment(reference);

    try {
      await cancelPayment(reference);
      toast.success("Payment cancelled", {
        description: "Your pending payment has been cancelled.",
      });
      // Refresh the payment list
      onRefresh?.();
    } catch (error: unknown) {
      console.error("Cancel payment error:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (error as { message?: string })?.message || "Failed to cancel payment";
      toast.error("Cancel Failed", { description: errorMessage });
    } finally {
      setProcessingPayment(null);
    }
  };

  const isPending = (status: string) => status.toLowerCase() === "pending";
  const isProcessing = (reference: string) => processingPayment === reference;
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No payment history available.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Total Paid</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {formatDate(payment.createdAt)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {payment.reference.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-right">
                    GH₵{payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    GH₵{(payment.amountPaid || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={payment.balanceOwed && payment.balanceOwed > 0 ? "text-orange-600" : "text-green-600"}>
                      GH₵{(payment.balanceOwed ?? 0).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPaymentStatusBadgeVariant(payment.status)}>
                      {getPaymentStatusLabel(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* View receipt for confirmed payments */}
                      {onViewReceipt && payment.status === "confirmed" && (
                        <button
                          onClick={() => onViewReceipt(payment.reference)}
                          className="text-primary hover:underline text-sm"
                        >
                          View
                        </button>
                      )}
                      {/* Retry and Cancel buttons for pending payments */}
                      {isPending(payment.status) && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetry(payment.reference)}
                            disabled={isProcessing(payment.reference)}
                            className="h-7 px-2 text-xs"
                          >
                            <RefreshCw className={`w-3 h-3 mr-1 ${isProcessing(payment.reference) ? "animate-spin" : ""}`} />
                            Retry
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(payment.reference)}
                            disabled={isProcessing(payment.reference)}
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {/* Empty cell for other statuses */}
                      {!onViewReceipt && payment.status === "confirmed" && <span className="text-muted-foreground text-xs">-</span>}
                      {!isPending(payment.status) && payment.status !== "confirmed" && <span className="text-muted-foreground text-xs">-</span>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
