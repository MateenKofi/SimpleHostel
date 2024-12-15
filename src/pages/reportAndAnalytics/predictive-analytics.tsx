"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type DateRange = {
  from: Date
  to: Date | undefined
}

type PredictionData = {
  date: string
  actual: number
  predicted: number
}

const generatePredictionData = (dateRange: DateRange): PredictionData[] => {
  const data: PredictionData[] = []
  const currentDate = new Date(dateRange.from)
  const endDate = new Date(dateRange.to || new Date())
  endDate.setMonth(endDate.getMonth() + 3) // Predict 3 months into the future

  while (currentDate <= endDate) {
    const isActual = currentDate <= (dateRange.to || new Date())
    data.push({
      date: currentDate.toISOString().split('T')[0],
      actual: isActual ? Math.floor(Math.random() * 30) + 70 : 0,
      predicted: Math.floor(Math.random() * 30) + 70
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

export function PredictiveAnalytics({ dateRange }: { dateRange: DateRange }) {
  const [data, setData] = useState<PredictionData[]>([])

  useEffect(() => {
    setData(generatePredictionData(dateRange))
  }, [dateRange])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Analytics</CardTitle>
        <CardDescription>Forecasted occupancy rates for the next 3 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            actual: {
              label: "Actual Occupancy",
              color: "hsl(var(--chart-1))",
            },
            predicted: {
              label: "Predicted Occupancy",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="actual" strokeWidth={2} />
              <Line type="monotone" dataKey="predicted" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

