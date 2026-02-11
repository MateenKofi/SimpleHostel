import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { COLORS } from "@/helper/chartColors";
import { Method, ReportData } from "@/helper/types/types";
import { formatCurrency } from "@/utils/formatCurrency";

const PaymentMethodBreakDown = ({ reportData }: { reportData: ReportData }) => {
  return (
    <div>
      {" "}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods Breakdown</CardTitle>
          <CardDescription>
            Detailed view of payment methods and amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData?.paymentMethods.map((method: Method, index: number) => (
              <div
                key={method.method}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                  <div>
                    <p className="font-medium capitalize">
                      {(method.method || "").replace("_", " ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {method.count} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {formatCurrency(method.totalAmount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(
                      (method.totalAmount / reportData?.totalRevenue) *
                      100
                    )?.toFixed(1)}
                    % of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodBreakDown;
