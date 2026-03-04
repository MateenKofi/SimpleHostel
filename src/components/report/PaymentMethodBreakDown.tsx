import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Method, ReportData } from "@/helper/types/types";
import { formatCurrency, getMethodIcon, getMethodIconSimple } from "@/utils";
import { CreditCard, Wallet, Landmark } from "lucide-react";

const FOREST_GREEN_COLORS = [
  "#4a9c7c", // Forest green primary
  "#3b7d63", // Darker forest green
  "#5cad8f", // Lighter forest green
  "#2d6350", // Even darker
  "#7bc4a8", // Light accent
];

const PaymentMethodBreakDown = ({ reportData }: { reportData: ReportData }) => {
  return (
    <Card className="border-forest-green-200/50 dark:border-forest-green-800/30 bg-gradient-to-br from-forest-green-50/20 to-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-sage-green-500 to-teal-green-600 shrink-0">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base md:text-lg">Payment Methods Breakdown</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Detailed view of payment methods and amounts
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 md:space-y-3">
          {reportData?.paymentMethods.map((method: Method, index: number) => {
            const percentage = ((method.totalAmount / reportData?.totalRevenue) * 100);
            const color = FOREST_GREEN_COLORS[index % FOREST_GREEN_COLORS.length];

            return (
              <div
                key={method.method}
                className="flex items-center justify-between gap-3 p-3 md:p-4 rounded-xl border border-border/60 bg-card/50 hover:bg-card transition-colors"
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div
                    className="p-2 md:p-2.5 rounded-xl shrink-0"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <div style={{ color }} className="h-4 w-4 md:h-5 md:w-5">
                      {getMethodIcon(method.method)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground capitalize text-sm md:text-base truncate">
                      {(method.method || "").replace(/_/g, " ")}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {method.count} transaction{method.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="font-bold text-base md:text-lg text-foreground">
                    {formatCurrency(method.totalAmount)}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
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
