import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportData } from "@/helper/types/types";
import { formatDate } from "@/utils/formatDate";
import { CalendarDays, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { formatCurrency } from "@/utils/formatCurrency";

const StatusCards = ({reportData}: {reportData: ReportData}) => {
  return (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Academic Year
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData?.calendarYearName}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Started: {formatDate(reportData?.startDate)}
                  </p>
                  <Badge
                    variant={reportData?.isActive ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {reportData?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Revenue Growth
                  </CardTitle>
                  {reportData?.revenueGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      reportData?.revenueGrowth >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {reportData?.revenueGrowth >= 0 ? "+" : ""}
                    {reportData?.revenueGrowth?.toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Compared to previous period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Collection Rate
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData?.collectionRate?.toFixed(1)}%
                  </div>
                  <Progress
                    value={reportData?.collectionRate}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(reportData?.totalRevenue)} of{" "}
                    {formatCurrency(reportData?.totalExpectedRevenue)}
                  </p>
                </CardContent>
              </Card>
            </div>
  )
}

export default StatusCards