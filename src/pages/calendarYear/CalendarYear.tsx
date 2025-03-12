"use client"
import { type SubmitHandler, useForm } from "react-hook-form"
import { CalendarClock, Plus, History, Loader } from "lucide-react"
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
import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import moment from "moment"
import { Skeleton } from "@/components/ui/skeleton"

interface ICalendarYear {
  id: string
  name: string
  hostelId: string
  startDate: Date
  endDate?: Date | null
  isActive: boolean
  financialReport?: {
    totalRevenue: number
    totalExpenses: number
  }
  Residents?: Array<{
    id: string
    name: string
  }>
}

interface FormValues {
  yearName: string
}

const CalendarYear = () => {
  const { data: currentYear, isLoading: isCurrentYearLoading } = useQuery<ICalendarYear>({
    queryKey: ["currentYear"],
    queryFn: async () => {
      const hostelId = localStorage.getItem("hostelId")
      const response = await axios.get(`/api/calendar/current/${hostelId}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return response?.data?.data
    },
  })

  const { data: historicalYearsResponse, isLoading: isHistoricalYearsLoading } = useQuery<{ data: ICalendarYear[] }>({
    queryKey: ["historicalYears"],
    queryFn: async () => {
      const hostelId = localStorage.getItem("hostelId")
      if (!hostelId) {
        throw new Error("Hostel ID is not available in local storage.")
      }
      const response = await axios.get(`/api/calendar/historical/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return response.data
    },
  })

  const historicalYears = historicalYearsResponse?.data || []

  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm<FormValues>()

  // Mutation for adding calendar year
  const AddCalendarYearMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const hostelId = localStorage.getItem("hostelId")
      const payload = {
        name: data.yearName,
        hostelId: hostelId || "",
      }
      const response = await axios.post(`/api/calendar/start`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentYear"] })
      queryClient.invalidateQueries({ queryKey: ["historicalYears"] })
      toast.success("Academic Year added successfully")
      reset()
    },
    onError: (error: unknown) => {
      console.error("Mutation error:", error)
      let errorMessage = "Failed to add Academic Year"
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage
      } else {
        errorMessage = (error as Error).message || errorMessage
      }
      toast.error(errorMessage)
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    AddCalendarYearMutation.mutate(data)
  }

  const deleteYear = (id: string) => {
    // Dummy function for deleting a year
    toast("Year deleted successfully")
  }

  // Current Year Skeleton
  const CurrentYearSkeleton = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarClock className="mr-2 h-5 w-5" />
          <Skeleton className="h-6 w-64" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-full max-w-md" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Historical Years Skeleton
  const HistoricalYearsSkeleton = () => (
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
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="w-full">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Form to add a new calendar year */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex justify-between items-center mb-8">
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
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Year Name</Label>
                <Input id="name" {...register("yearName")} placeholder="e.g., Academic Year 2024-2025" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={AddCalendarYearMutation.isPending}>
                  {AddCalendarYearMutation.isPending ? <Loader className="animate-spin" /> : "Create Year"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </form>

      {/* Current Calendar Year Card */}
      {isCurrentYearLoading ? (
        <CurrentYearSkeleton />
      ) : currentYear ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarClock className="mr-2 h-5 w-5" />
              Current Calendar Year: <p className="ml-2 ">{currentYear?.name}</p>
            </CardTitle>
            <CardDescription>
              {currentYear?.isActive
                ? "Active calendar year details and financial summary"
                : "This calendar year has ended"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Started on:{" "}
                  {currentYear?.startDate
                    ? moment(currentYear?.startDate).format("dddd, MMMM Do YYYY, h:mm:ss a")
                    : "No start date"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ended on: {currentYear?.endDate ? moment(currentYear?.endDate).format("MM/DD/YYYY") : "No end date"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center">No current calendar year found.</p>
      )}

      {/* Historical Calendar Years Card */}
      {isHistoricalYearsLoading ? (
        <HistoricalYearsSkeleton />
      ) : (
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
              {historicalYears.length > 0 ? (
                historicalYears.map((year) => (
                  <div key={year.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h3 className="font-semibold">{year.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Started on {new Date(year.startDate).toLocaleDateString()}
                      </p>
                      {year.endDate && (
                        <p className="text-sm text-muted-foreground">
                          Ended on {new Date(year.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {/* <Dialog>
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
                                        </Dialog> */}
                  </div>
                ))
              ) : (
                <p className="text-center py-4">No historical calendar years found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CalendarYear

