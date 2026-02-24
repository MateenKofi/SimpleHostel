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
    <Card className="border-forest-green-200/50 dark:border-forest-green-800/30 bg-gradient-to-br from-forest-green-50/30 to-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-forest-green-500 to-teal-green-600 shrink-0">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base md:text-lg">Monthly Revenue Trend</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Revenue throughout the academic year
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "#4a9c7c",
            },
          }}
          className="h-[250px] md:h-[300px] w-full aspect-auto"
        >
          <BarChart data={reportData?.monthlyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/40" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              interval="preserveStartEnd"
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value;
              }}
              className="text-xs text-muted-foreground"
              width={50}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              labelFormatter={(label) => label}
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
            <Bar
              dataKey="revenue"
              fill="url(#revenueGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a9c7c" stopOpacity={1} />
                <stop offset="100%" stopColor="#3b7d63" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyRevenue;
