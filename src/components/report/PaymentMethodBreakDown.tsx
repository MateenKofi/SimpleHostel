import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Method, ReportData } from "@/helper/types/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { CreditCard, Wallet, Landmark } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const FOREST_GREEN_COLORS = [
  "#4a9c7c", // Forest green primary
  "#3b7d63", // Darker forest green
  "#5cad8f", // Lighter forest green
  "#2d6350", // Even darker
  "#7bc4a8", // Light accent
];

const getMethodIcon = (method: string) => {
  const lowerMethod = method.toLowerCase();
  if (lowerMethod.includes("mobile") || lowerMethod.includes("momo")) {
    return <Wallet className="h-5 w-5" />;
  }
  if (lowerMethod.includes("bank") || lowerMethod.includes("transfer")) {
    return <Landmark className="h-5 w-5" />;
  }
  return <CreditCard className="h-5 w-5" />;
};

const PaymentMethodBreakDown = ({ reportData }: { reportData: ReportData }) => {
  return (
    <Card className="border-forest-green-200/50 dark:border-forest-green-800/30 bg-gradient-to-br from-forest-green-50/20 to-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-sage-green-500 to-teal-green-600">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle>Payment Methods Breakdown</CardTitle>
            <CardDescription>
              Detailed view of payment methods and amounts
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reportData?.paymentMethods.map((method: Method, index: number) => {
            const percentage = ((method.totalAmount / reportData?.totalRevenue) * 100);
            const color = FOREST_GREEN_COLORS[index % FOREST_GREEN_COLORS.length];

            return (
              <div
                key={method.method}
                className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card/50 hover:bg-card transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <div style={{ color }}>
                      {getMethodIcon(method.method)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground capitalize">
                      {(method.method || "").replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {method.count} transaction{method.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-lg text-foreground">
                    {formatCurrency(method.totalAmount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {percentage?.toFixed(1)}% of total
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodBreakDown;
