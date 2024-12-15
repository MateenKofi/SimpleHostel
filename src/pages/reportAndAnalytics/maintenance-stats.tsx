"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Pending", value: 5 },
  { name: "In Progress", value: 7 },
  { name: "Completed", value: 20 },
]

const COLORS = ["#FF8042", "#FFBB28", "#00C49F"]

export function MaintenanceStats() {
  return (
    <ChartContainer
      config={{
        pending: {
          label: "Pending",
          color: COLORS[0],
        },
        inProgress: {
          label: "In Progress",
          color: COLORS[1],
        },
        completed: {
          label: "Completed",
          color: COLORS[2],
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

