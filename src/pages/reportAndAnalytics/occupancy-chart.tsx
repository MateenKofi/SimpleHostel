"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type DateRange = {
  from: Date
  to: Date | undefined
}

type OccupancyData = {
  name: string
  occupancy: number
  details: {
    roomType: string
    occupancy: number
  }[]
}

const generateMockData = (dateRange: DateRange): OccupancyData[] => {
  const data: OccupancyData[] = []
  const currentDate = new Date(dateRange.from)
  const endDate = dateRange.to || new Date()

  while (currentDate <= endDate) {
    data.push({
      name: currentDate.toISOString().split('T')[0],
      occupancy: Math.floor(Math.random() * 30) + 70,
      details: [
        { roomType: "Single", occupancy: Math.floor(Math.random() * 30) + 70 },
        { roomType: "Double", occupancy: Math.floor(Math.random() * 30) + 70 },
        { roomType: "Dormitory", occupancy: Math.floor(Math.random() * 30) + 70 },
      ]
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

export function OccupancyChart({ dateRange }: { dateRange: DateRange }) {
  const [data, setData] = useState<OccupancyData[]>([])
  const [selectedDay, setSelectedDay] = useState<OccupancyData | null>(null)

  useEffect(() => {
    setData(generateMockData(dateRange))

    // Simulating real-time updates
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData]
        const lastIndex = newData.length - 1
        newData[lastIndex] = {
          ...newData[lastIndex],
          occupancy: Math.floor(Math.random() * 30) + 70
        }
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [dateRange])

  const handleDataPointClick = (data: OccupancyData) => {
    setSelectedDay(data)
  }

  return (
    <>
      <ChartContainer
        config={{
          occupancy: {
            label: "Occupancy Rate",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="occupancy"
              strokeWidth={2}
              activeDot={{
                r: 8,
                onClick: (_, payload) => handleDataPointClick(payload.payload as OccupancyData)
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4" disabled={!selectedDay}>
            View Details for {selectedDay?.name}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Occupancy Details for {selectedDay?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedDay?.details.map((detail, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span>{detail.roomType}</span>
                <span>{detail.occupancy}%</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

