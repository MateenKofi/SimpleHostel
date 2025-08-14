import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportData } from "@/helper/types/types";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  BadgeCent,
  Users,
  Building,
  CreditCard,
} from "lucide-react";

const KeyMetrics = ({reportData}: {reportData: ReportData}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <BadgeCent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(reportData?.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {reportData?.totalPayments} payments made
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Residents
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData?.totalResidents}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Avg revenue:{" "}
                    {formatCurrency(reportData?.averageRevenuePerResident)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Room Occupancy
                  </CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData?.occupancyRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {reportData?.occupiedRooms} of {reportData?.totalRooms}{" "}
                    rooms
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Payment
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(reportData?.averagePaymentAmount)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Avg room price:{" "}
                    {formatCurrency(reportData?.averageRoomPrice)}
                  </p>
                </CardContent>
              </Card>
            </div>
  )
}

export default KeyMetrics