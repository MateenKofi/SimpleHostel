import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { COLORS } from "@/helper/chartColors";
import { Method, ReportData } from "@/helper/types/types";

const PaymentMethod = ({ reportData }: { reportData: ReportData }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Distribution of payment methods used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              mobile_money: {
                label: "Mobile Money",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <PieChart>
              <Pie
                data={reportData?.paymentMethods.map(
                  (method: Method, index: number) => ({
                    ...method,
                    fill: COLORS[index % COLORS.length],
                  })
                )}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ method, count }) => `${method}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="totalAmount"
              >
                {reportData?.paymentMethods.map(
                  (entry: Method, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethod;
