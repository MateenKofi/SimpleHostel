"use client"
import { type SubmitHandler, useForm } from "react-hook-form"
import { CalendarClock,History } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import AddCalendarYearForm from "@/components/AddCalendarYearFrom"
import CurrentYearCard from "@/components/CalenderYearCard"
import HistoricalYearsList from "@/components/HistoricalYearsList"
import { CalendarYearT } from "@/types/types"


interface FormValues {
  yearName: string
}

const CalendarYear = () => {
  const { data: currentYear, isLoading: isCurrentYearLoading } = useQuery<CalendarYearT>({
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

  const { data: historicalYearsResponse, isLoading: isHistoricalYearsLoading } = useQuery<{ data: CalendarYearT[] }>({
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
      <AddCalendarYearForm
        onSubmit={onSubmit}
        isPending={AddCalendarYearMutation.isPending}
        register={register}
        handleSubmit={handleSubmit}
      />

{isCurrentYearLoading ? (
        <CurrentYearSkeleton />
      ) : (
        <CurrentYearCard currentYear={currentYear} />
      )}

{isHistoricalYearsLoading ? (
        <HistoricalYearsSkeleton />
      ) : (
        <HistoricalYearsList historicalYears={historicalYears} />
      )}
    </div>
  )
}

export default CalendarYear

