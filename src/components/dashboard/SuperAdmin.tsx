
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import {  Banknote, Building, Percent, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Analytics data
const analyticsData = {
  totalRevenue: 2301.68,
  totalDebt: 180.3,
  debtPercentage: 2.46,
  expectedIncome: 7325.39,
  totalPayments: 9,
  averagePaymentAmount: 260.96,
  occupancyRate: 33.33,
  totalRooms: 14,
  activeRooms: 12,
  occupiedRooms: 4,
  totalResidents: 6,
  totalDebtors: 1,
  debtorsPercentage: 16.67,
  averageDebtPerResident: 180.3,
  totalStaff: 0,
  averageRoomPrice: 523.24,
  currentYearStats: {
    totalPayments: 9,
    expectedRevenue: 7325.39,
    collectedRevenue: 2301.68,
    outstandingAmount: 180.3,
  },
  totalHostels: 8,
  verifiedHostels: 7,
  unverifiedHostels: 1,
  publishedHostels: 6,
  averageOccupancyRate: 33.33,
  systemWideDebtPercentage: 2.46,
  activeCalendarYears: 6,
}


const occupancyData = [
  { name: "Occupied", value: analyticsData.occupiedRooms },
  { name: "Vacant", value: analyticsData.activeRooms - analyticsData.occupiedRooms },
]

const hostelStatusData = [
  { name: "Published", value: analyticsData.publishedHostels },
  { name: "Verified (Unpublished)", value: analyticsData.verifiedHostels - analyticsData.publishedHostels },
  { name: "Unverified", value: analyticsData.unverifiedHostels },
]

// Revenue comparison data for bar chart
const revenueBarData = [
  {
    name: "Revenue",
    Collected: analyticsData.currentYearStats.collectedRevenue,
    Expected: analyticsData.currentYearStats.expectedRevenue,
    Outstanding: analyticsData.currentYearStats.outstandingAmount,
  },
]

// Color scheme
const COLORS = ["#FF0000", "#000000", "#DDDDDD"]
const CHART_COLORS = {
  red: "#FF0000",
  black: "#000000",
  gray: "#AAAAAA",
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: GH₵${entry.value.toFixed(2)}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const SuperAdmin = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      
      <div className="flex flex-1">
       
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <Banknote className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">GH₵{analyticsData.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-gray-500">of GH₵{analyticsData.expectedIncome.toFixed(2)} expected</p>
                <div className="mt-3">
                  <Progress
                    value={(analyticsData.totalRevenue / analyticsData.expectedIncome) * 100}
                    className="bg-gray-200"
                  
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <Percent className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.occupancyRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-500">
                  {analyticsData.occupiedRooms} of {analyticsData.activeRooms} rooms occupied
                </p>
                <div className="mt-3">
                  <Progress
                    value={analyticsData.occupancyRate}
                    className="bg-gray-200"
                  
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
                <Building className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalHostels}</div>
                <p className="text-xs text-gray-500">
                  {analyticsData.publishedHostels} published, {analyticsData.verifiedHostels} verified
                </p>
                <div className="mt-3">
                  <Progress
                    value={(analyticsData.publishedHostels / analyticsData.totalHostels) * 100}
                    className="bg-gray-200"
                  
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalResidents}</div>
                <p className="text-xs text-gray-500">{analyticsData.totalDebtors} with outstanding debt</p>
                <div className="mt-3">
                  <Progress
                    value={100 - analyticsData.debtorsPercentage}
                    className="bg-gray-200"
                  
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-gray-200">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription className="text-gray-500">Current year revenue collection status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Collected" fill={CHART_COLORS.red} />
                      <Bar dataKey="Expected" fill={CHART_COLORS.black} />
                      <Bar dataKey="Outstanding" fill={CHART_COLORS.gray} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Collected</div>
                    <div className="text-lg font-bold">
                      GH₵{analyticsData.currentYearStats.collectedRevenue.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Expected</div>
                    <div className="text-lg font-bold">
                      GH₵{analyticsData.currentYearStats.expectedRevenue.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Outstanding</div>
                    <div className="text-lg font-bold">
                      GH₵{analyticsData.currentYearStats.outstandingAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 border-gray-200">
              <CardHeader>
                <CardTitle>Occupancy Status</CardTitle>
                <CardDescription className="text-gray-500">Current room occupancy breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {occupancyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Total Rooms</div>
                    <div className="text-lg font-bold">{analyticsData.totalRooms}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Active Rooms</div>
                    <div className="text-lg font-bold">{analyticsData.activeRooms}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Hostel Status</CardTitle>
                <CardDescription className="text-gray-500">
                  Overview of hostel verification and publication status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={hostelStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {hostelStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
                      <span className="text-xs font-medium">Published</span>
                    </div>
                    <div className="text-lg font-bold">{analyticsData.publishedHostels}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                    <div className="text-lg font-bold">{analyticsData.verifiedHostels}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[2] }}></div>
                      <span className="text-xs font-medium">Unverified</span>
                    </div>
                    <div className="text-lg font-bold">{analyticsData.unverifiedHostels}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Payment Statistics</CardTitle>
                <CardDescription className="text-gray-500">Overview of payment and debt information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Total Payments</div>
                      <div className="text-2xl font-bold">{analyticsData.totalPayments}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Average Payment</div>
                      <div className="text-2xl font-bold">GH₵{analyticsData.averagePaymentAmount.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Total Debt</div>
                      <div className="text-2xl font-bold">GH₵{analyticsData.totalDebt.toFixed(2)}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Debt Percentage</div>
                      <div className="text-2xl font-bold">{analyticsData.debtPercentage.toFixed(2)}%</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="text-sm font-medium">Debt Status</div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div>Debt-free Residents</div>
                        <div>
                          {analyticsData.totalResidents - analyticsData.totalDebtors} of {analyticsData.totalResidents}
                        </div>
                      </div>
                      <Progress
                        value={
                          ((analyticsData.totalResidents - analyticsData.totalDebtors) / analyticsData.totalResidents) *
                          100
                        }
                        className="mt-1 bg-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription className="text-gray-500">Key system-wide metrics and statistics</CardDescription>
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
                      <TableCell className="font-medium">Average Room Price</TableCell>
                      <TableCell>GH₵{analyticsData.averageRoomPrice.toFixed(2)}</TableCell>
                      <TableCell>Average price across all rooms</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">System-wide Debt Percentage</TableCell>
                      <TableCell>{analyticsData.systemWideDebtPercentage.toFixed(2)}%</TableCell>
                      <TableCell>Percentage of total expected revenue that is debt</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Average Occupancy Rate</TableCell>
                      <TableCell>{analyticsData.averageOccupancyRate.toFixed(2)}%</TableCell>
                      <TableCell>Average occupancy across all hostels</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Active Calendar Years</TableCell>
                      <TableCell>{analyticsData.activeCalendarYears}</TableCell>
                      <TableCell>Number of active calendar years in the system</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Average Debt Per Resident</TableCell>
                      <TableCell>GH₵{analyticsData.averageDebtPerResident.toFixed(2)}</TableCell>
                      <TableCell>Average debt amount per resident with debt</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SuperAdmin