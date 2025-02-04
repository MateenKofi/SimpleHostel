"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface OccupancyData {
    vacant: number
    occupied: number
    notReady: number
}

interface OccupancyCardProps {
    data?: OccupancyData
    colors?: {
        vacant: string
        occupied: string
        notReady: string
    }
}

const OccupancyCard: React.FC<OccupancyCardProps> = ({
    data = { vacant: 0, occupied: 0, notReady: 0 },
    colors = {
        vacant: "#000000", // Default to emerald-800
        occupied: "#36454F", // Default to emerald-500
        notReady: "#c1bcbb", // Default to emerald-200
    },
}) => {
    // Ensure we have valid numbers, defaulting to 0 if undefined
    const vacant = data?.vacant ?? 0
    const occupied = data?.occupied ?? 0
    const notReady = data?.notReady ?? 0

    const total = vacant + occupied + notReady

    // Calculate percentages for the bar widths, protecting against division by zero
    const vacantWidth = total > 0 ? (vacant / total) * 100 : 0
    const occupiedWidth = total > 0 ? (occupied / total) * 100 : 0
    const notReadyWidth = total > 0 ? (notReady / total) * 100 : 0

    return (
        <Card className="w-full">
            <CardHeader>
                <h3 className="text-lg font-semibold">Occupancy</h3>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="w-fit flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.vacant }} />
                            <span className="text-sm text-muted-foreground">Vacant</span>
                        </div>
                        <span className="text-center text-6xl font-medium">{vacant.toString().padStart(2, "0")}</span>
                    </div>
                    <div className="w-fit flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.occupied }} />
                            <span className="text-sm text-muted-foreground">Occupied</span>
                        </div>
                        <span className="text-center text-6xl font-medium">{occupied.toString().padStart(2, "0")}</span>
                    </div>
                    <div className="w-fit flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.notReady }} />
                            <span className="text-sm text-muted-foreground">Not ready</span>
                        </div>
                        <span className="text-center text-6xl font-medium">{notReady.toString().padStart(2, "0")}</span>
                    </div>
                </div>

                <div className="flex h-8 w-full overflow-hidden rounded-lg">
                    <div
                        className="transition-all duration-500 rounded-l-lg"
                        style={{ width: `${vacantWidth}%`, backgroundColor: colors.vacant }}
                    />
                    <div
                        className="transition-all duration-500"
                        style={{ width: `${occupiedWidth}%`, backgroundColor: colors.occupied }}
                    />
                    <div
                        className="transition-all duration-500 rounded-r-lg"
                        style={{ width: `${notReadyWidth}%`, backgroundColor: colors.notReady }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default OccupancyCard
