import {
  BadgeCent,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TransactionsSkeleton from "../loaders/TransactionLoader";
import { getDisbursementSummary, getSystemTransactionMetrics } from "@/api/analytics";
import { useQuery } from "@tanstack/react-query";
import CustomeRefetch from "../CustomRefetch";
import { formatCurrency } from "@/utils";
import CustomDataTable from "../CustomDataTable";
import type { TableColumn } from "react-data-table-component";

interface Hostel {
  hostelId: string;
  name: string;
  phone: string;
  email: string;
  amountCollected: number;
}

interface DisbursementData {
  totalCollected: number;
  disbursements: Hostel[];
}

const SuperAdminTransaction = () => {
  const {
    data: transactionData,
    isLoading,
    isError,
    refetch,
  } = useQuery<DisbursementData>({
    queryKey: ["disbursements"],
    queryFn: async () => {
      const responseData = await getDisbursementSummary();
      return responseData?.data;
    },
  });

  // Fetch system transaction metrics from backend
  const { data: metricsData } = useQuery({
    queryKey: ['system_transaction_metrics'],
    queryFn: async () => {
      const responseData = await getSystemTransactionMetrics();
      return responseData?.data;
    },
  });

  const metrics = metricsData || {
    totalAmount: 0,
    totalTransactions: 0,
    successfulAmount: 0,
    successfulTransactions: 0,
    pendingAmount: 0,
    pendingTransactions: 0,
    cancelledAmount: 0,
    cancelledTransactions: 0,
  };

  const hostelColumns: TableColumn<Hostel>[] = [
    {
      name: "Hostel Name",
      selector: (hostel) => hostel.name || "",
      sortable: true,
      minWidth: "250px",
      cell: (hostel) => (
        <div className="flex items-center gap-2">

          <span className="font-medium">{hostel.name}</span>
          {hostel.amountCollected > 0 && (
            <Badge
              variant="outline"
              className="ml-2 border-forest-green-200 bg-forest-green-100 text-forest-green-800 dark:border-forest-green-800 dark:bg-forest-green-900 dark:text-forest-green-100"
            >
              Active
            </Badge>
          )}
        </div>
      ),
    },
    {
      name: "Phone",
      selector: (hostel) => hostel.phone || "",
      sortable: true,
    },
    {
      name: "Email",
      selector: (hostel) => hostel.email || "",
      sortable: true,
    },
    {
      name: "Amount",
      selector: (hostel) => hostel.amountCollected,
      sortable: true,
      right: true,
      cell: (hostel) => (
        <span className="font-medium">
          {formatCurrency(hostel.amountCollected)}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <TransactionsSkeleton />;
  }
  if (isError) {
    return <CustomeRefetch refetch={refetch} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <section className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          System Transaction Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Transaction metrics across all hostels
        </p>
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BadgeCent className="w-5 h-5 mr-2 text-muted-foreground" />
                <div className="text-2xl font-bold">GH¢{metrics.totalAmount.toFixed(2)}</div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {metrics.totalTransactions} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Successful Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-forest-green-500" />
                <div className="text-2xl font-bold text-forest-green-600">
                  GH¢{metrics.successfulAmount.toFixed(2)}
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {metrics.successfulTransactions} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                <div className="text-2xl font-bold text-yellow-600">
                  GH¢{metrics.pendingAmount.toFixed(2)}
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {metrics.pendingTransactions} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cancelled Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-destructive" />
                <div className="text-2xl font-bold text-destructive">
                  GH¢{metrics.cancelledAmount.toFixed(2)}
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {metrics.cancelledTransactions} transactions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              Hostel Disbursement Summary
            </h3>
            <p className="text-sm text-muted-foreground">
              Disbursement breakdown by hostel
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-forest-green-50 px-4 py-2 text-forest-green-700 dark:bg-forest-green-950 dark:text-forest-green-300">
            <BadgeCent className="w-5 h-5" />
            <div>
              <p className="text-xs font-medium">Total Collected</p>
              <p className="text-lg font-bold">
                {formatCurrency(transactionData?.totalCollected || 0)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CustomDataTable
        title="Hostel Disbursement Summary"
        columns={hostelColumns}
        data={transactionData?.disbursements || []}
        exportFilename="hostel-disbursement-summary.csv"
        emptyStateMessage="No hostels found."
      />
    </div>
  );
};

export default SuperAdminTransaction;
