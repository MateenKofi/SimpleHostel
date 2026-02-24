import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { COLORS } from "@/helper/chartColors";
import { Method, ReportData } from "@/helper/types/types";
import { CreditCard } from "lucide-react";

const FOREST_GREEN_COLORS = [
  "#4a9c7c", // Forest green primary
  "#3b7d63", // Darker forest green
  "#5cad8f", // Lighter forest green
  "#2d6350", // Even darker
  "#7bc4a8", // Light accent
  "#e8f5f0", // Very light (background)
];

const PaymentMethod = ({ reportData }: { reportData: ReportData }) => {
  return (
    <div>
      <Card className="border-teal-green-200/50 dark:border-teal-green-800/30 bg-gradient-to-br from-teal-green-50/30 to-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-green-500 to-forest-green-600">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Distribution of payment methods used
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              mobile_money: {
                label: "Mobile Money",
                color: FOREST_GREEN_COLORS[0],
              },
              cash: {
                label: "Cash",
                color: FOREST_GREEN_COLORS[1],
              },
              bank_transfer: {
                label: "Bank Transfer",
                color: FOREST_GREEN_COLORS[2],
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData?.paymentMethods.map(
                    (method: Method, index: number) => ({
                      ...method,
                      fill: FOREST_GREEN_COLORS[index % FOREST_GREEN_COLORS.length],
                    })
                  )}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ method, percent }) =>
                    `${method}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="totalAmount"
                  className="text-xs"
                >
                  {reportData?.paymentMethods.map(
                    (entry: Method, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={FOREST_GREEN_COLORS[index % FOREST_GREEN_COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethod;
