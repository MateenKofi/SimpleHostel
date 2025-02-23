"use client"

import * as React from "react"
import { CalendarClock, Plus, History, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"

interface ICalendarYear {
    id: string
    name: string
    hostelId: string
    startDate: Date
    isActive: boolean
    financialReport?: {
        totalRevenue: number
        totalExpenses: number
    }
}

const CalendarYear = () => {
    const [currentYear, setCurrentYear] = React.useState<ICalendarYear | null>({
        id: "1",
        name: "Academic Year 2023-2024",
        hostelId: "hostel1",
        startDate: new Date("2023-01-01"),
        isActive: true,
        financialReport: {
            totalRevenue: 50000,
            totalExpenses: 30000,
        },
    })
    const [historicalYears, setHistoricalYears] = React.useState<ICalendarYear[]>([
        {
            id: "2",
            name: "Academic Year 2022-2023",
            hostelId: "hostel1",
            startDate: new Date("2022-01-01"),
            isActive: false,
            financialReport: {
                totalRevenue: 45000,
                totalExpenses: 25000,
            },
        },
        {
            id: "3",
            name: "Academic Year 2021-2022",
            hostelId: "hostel1",
            startDate: new Date("2021-01-01"),
            isActive: false,
            financialReport: {
                totalRevenue: 40000,
                totalExpenses: 20000,
            },
        },
    ])
    const [loading, setLoading] = React.useState(false)
    const [newYearName, setNewYearName] = React.useState("")

    const startNewYear = () => {
        // Dummy function for starting a new year
        toast({ title: "New year started", description: newYearName })
    }

    const deleteYear = (id: string) => {
        // Dummy function for deleting a year
        toast({ title: "Year deleted", description: `Year ID: ${id}` })
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Calendar Year Management</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Start New Year
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Start New Calendar Year</DialogTitle>
                            <DialogDescription>
                                Enter a name for the new calendar year. This will create a new active year.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Year Name</Label>
                                <Input
                                    id="name"
                                    value={newYearName}
                                    onChange={(e) => setNewYearName(e.target.value)}
                                    placeholder="e.g., Academic Year 2024-2025"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={startNewYear}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {currentYear && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CalendarClock className="mr-2 h-5 w-5" />
                            Current Calendar Year
                        </CardTitle>
                        <CardDescription>Active calendar year details and financial summary</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div>
                                <h3 className="font-semibold">{currentYear.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Started on {new Date(currentYear.startDate).toLocaleDateString()}
                                </p>
                            </div>
                            {currentYear.financialReport && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-muted">
                                        <p className="text-sm font-medium">Total Revenue</p>
                                        <p className="text-2xl font-bold">${currentYear.financialReport.totalRevenue.toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted">
                                        <p className="text-sm font-medium">Total Expenses</p>
                                        <p className="text-2xl font-bold">${currentYear.financialReport.totalExpenses.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <History className="mr-2 h-5 w-5" />
                        Historical Calendar Years
                    </CardTitle>
                    <CardDescription>Previous calendar years and their financial summaries</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {historicalYears.map((year) => (
                            <div key={year.id} className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <h3 className="font-semibold">{year.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Started on {new Date(year.startDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Delete Calendar Year</DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to delete this calendar year? This action cannot be undone.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="destructive" onClick={() => deleteYear(year.id)}>
                                                Delete
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CalendarYear
