import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportData } from "@/helper/types/types";
import { formatCurrency } from "@/utils/formatCurrency";

const HistoricalComparison = ({ reportData }: { reportData: ReportData }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Historical Comparison</CardTitle>
          <CardDescription>Current vs historical performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Period</p>
              <div className="text-2xl font-bold">
                {formatCurrency(reportData?.totalRevenue)}
              </div>
              <p className="text-sm text-muted-foreground">
                {reportData?.totalResidents} residents
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Historical</p>
              <div className="text-2xl font-bold">
                {formatCurrency(reportData?.historicalRevenue)}
              </div>
              <p className="text-sm text-muted-foreground">
                {reportData?.historicalResidents} residents
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricalComparison;
