import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { TableHeader, TableRow, TableHead, TableBody, TableCell,Table } from '../ui/table'
import { Analytics } from '@/helper/types/types'

type analyticsData = Analytics
const SystemOverviewTable = ({ analyticsData }: { analyticsData: analyticsData }) => {
  return (
     <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription className="text-gray-500">
                  Key system-wide metrics and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Average Room Price
                      </TableCell>
                      <TableCell>
                        GH₵{analyticsData ? analyticsData.averageRoomPrice?.toFixed(2) : 'N/A'}
                      </TableCell>
                      <TableCell>Average price across all rooms</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        System-wide Debt Percentage
                      </TableCell>
                      <TableCell>
                        {analyticsData ? analyticsData.systemWideDebtPercentage?.toFixed(2) : 'N/A'}
                        %
                      </TableCell>
                      <TableCell>
                        Percentage of total expected revenue that is debt
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Average Occupancy Rate
                      </TableCell>
                      <TableCell>
                        {analyticsData ? analyticsData.averageOccupancyRate?.toFixed(2) : 'N/A'}
                        %
                      </TableCell>
                      <TableCell>
                        Average occupancy across all hostels
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Active Calendar Years
                      </TableCell>
                      <TableCell>
                        {analyticsData ? analyticsData.activeCalendarYears : 'N/A'}
                      </TableCell>
                      <TableCell>
                        Number of active calendar years in the system
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Average Debt Per Resident
                      </TableCell>
                      <TableCell>
                        GH₵{analyticsData ? analyticsData.averageDebtPerResident?.toFixed(2) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        Average debt amount per resident with debt
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
  )
}

export default SystemOverviewTable
