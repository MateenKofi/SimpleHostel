"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Jan", revenue: 21000 },
  { name: "Feb", revenue: 23500 },
  { name: "Mar", revenue: 27000 },
  { name: "Apr", revenue: 25000 },
  { name: "May", revenue: 29000 },
  { name: "Jun", revenue: 31500 },
  { name: "Jul", revenue: 34000 },
  { name: "Aug", revenue: 33000 },
  { name: "Sep", revenue: 30000 },
  { name: "Oct", revenue: 28000 },
  { name: "Nov", revenue: 26500 },
  { name: "Dec", revenue: 24000 },
]

export function RevenueChart() {
  return (
    <ChartContainer
      config={{
        revenue: {
          label: "Revenue",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

