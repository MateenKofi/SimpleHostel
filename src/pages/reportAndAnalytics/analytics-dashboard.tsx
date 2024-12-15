"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { OccupancyChart } from "./occupancy-chart"
import { RevenueChart } from "./revenue-chart"
import { MaintenanceStats } from "./maintenance-stats"
import { PredictiveAnalytics } from "./predictive-analytics"
import { CustomAlerts } from "./custom-alerts"

const AnalyticsDashboard =()=> {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })

  const exportData = (format: "csv" | "pdf") => {
    // Implement export logic here
    console.log(`Exporting data in ${format} format`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <div className="space-x-2">
          <Button onClick={() => exportData("csv")} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => exportData("pdf")} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Existing overview content */}
        </TabsContent>
        <TabsContent value="occupancy">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rates</CardTitle>
              <CardDescription>Detailed view of occupancy rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <OccupancyChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Breakdown of revenue sources and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Statistics</CardTitle>
              <CardDescription>Overview of maintenance tasks and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <MaintenanceStats dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="predictive">
          <PredictiveAnalytics dateRange={dateRange} />
        </TabsContent>
      </Tabs>
      <CustomAlerts />
    </div>
  )
}
export default AnalyticsDashboard

