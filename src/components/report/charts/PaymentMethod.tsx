import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
  // Prepare chart data with color mapping
  const chartData = reportData?.paymentMethods.map(
    (method: Method, index: number) => ({
      ...method,
      fill: FOREST_GREEN_COLORS[index % FOREST_GREEN_COLORS.length],
    })
  ) || [];

  return (
    <Card className="border-teal-green-200/50 dark:border-teal-green-800/30 bg-gradient-to-br from-teal-green-50/30 to-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-teal-green-500 to-forest-green-600 shrink-0">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base md:text-lg">Payment Methods</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Distribution of payment methods used
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={chartData.reduce((acc, method) => {
            acc[method.method] = {
              label: method.method.replace(/_/g, ' '),
              color: method.fill,
            };
            return acc;
          }, {} as Record<string, { label: string; color: string }>)}
          className="h-[250px] md:h-[300px] w-full aspect-auto"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => {
                  const percentage = (percent * 100).toFixed(0);
                  // Only show label if slice is large enough on mobile
                  if (percent < 0.1) return null;
                  return `${percentage}%`;
                }}
                outerRadius={80}
                innerRadius={45}
                dataKey="totalAmount"
                className="text-xs"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke="var(--card)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => {
                  const formatted = new Intl.NumberFormat('en-GH', {
                    style: 'currency',
                    currency: 'GHS',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(value);
                  return formatted;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        {/* Legend for mobile - showing below chart */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {chartData.map((method, index) => {
            const percentage = ((method.totalAmount / reportData?.totalRevenue) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: method.fill }}
                />
                <span className="text-muted-foreground truncate">
                  {method.method.replace(/_/g, ' ')}
                </span>
                <span className="font-medium text-foreground ml-auto">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethod;
