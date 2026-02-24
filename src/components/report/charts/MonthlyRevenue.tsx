import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ReportData } from "@/helper/types/types";
import { Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis, } from "recharts";
import { TrendingUp } from "lucide-react";

const MonthlyRevenue = ({ reportData }: { reportData: ReportData }) => {
  return (
    <div>
      <Card className="border-forest-green-200/50 dark:border-forest-green-800/30 bg-gradient-to-br from-forest-green-50/30 to-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-forest-green-500 to-teal-green-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle>Monthly Revenue Trend</CardTitle>
              <CardDescription>
                Revenue and payments throughout the year
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "#4a9c7c",
              },
              payments: {
                label: "Payments",
                color: "#3b7d63",
              },
            }}
            className="h-[300px] w-full pl-0 ml-0"
          >
            <BarChart data={reportData?.monthlyStats}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/40" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                className="text-xs text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs text-muted-foreground"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="revenue"
                fill="url(#revenueGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a9c7c" />
                  <stop offset="100%" stopColor="#3b7d63" />
                </linearGradient>
              </defs>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyRevenue;
