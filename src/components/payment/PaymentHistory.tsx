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
import { Receipt } from "lucide-react";

interface PaymentHistoryProps {
  payments: PaymentDto[];
  onViewReceipt?: (reference: string) => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments, onViewReceipt }) => {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "success":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

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
                {onViewReceipt && <TableHead className="text-right">Action</TableHead>}
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
                    <Badge variant={getStatusVariant(payment.status)}>
                      {getStatusLabel(payment.status)}
                    </Badge>
                  </TableCell>
                  {onViewReceipt && payment.status === "confirmed" && (
                    <TableCell className="text-right">
                      <button
                        onClick={() => onViewReceipt(payment.reference)}
                        className="text-primary hover:underline text-sm"
                      >
                        View
                      </button>
                    </TableCell>
                  )}
                  {onViewReceipt && payment.status !== "confirmed" && (
                    <TableCell />
                  )}
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
