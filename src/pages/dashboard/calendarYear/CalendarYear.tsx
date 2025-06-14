"use client";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import AddCalendarYearForm from "@/components/AddCalendarYearFrom";
import CurrentYearCard from "@/components/CalenderYearCard";
import HistoricalYearsList from "@/components/HistoricalYearsList";
import { CalendarYearT } from "@/helper/types/types";
import HistoricalYearsSkeleton from "@/components/loaders/HIstoricalYearsSkeleton";
import CurrentYearSkeleton from "@/components/loaders/CurrentYearSkeleton";
import SEOHelmet from "@/components/SEOHelmet";

interface FormValues {
  yearName: string;
}

const CalendarYear = () => {
  const { data: currentYear, isLoading: isCurrentYearLoading,refetch:refectCurrentYear } =
    useQuery<CalendarYearT>({
      queryKey: ["currentYear"],
      queryFn: async () => {
        const hostelId = localStorage.getItem("hostelId");
        const response = await axios.get(`/api/calendar/current/${hostelId}` );
        return response?.data?.data;
      },
    });

  const { data: historicalYearsResponse, isLoading: isHistoricalYearsLoading,refetch:refectHistoricalYears } =
    useQuery<{ data: CalendarYearT[] }>({
      queryKey: ["historicalYears"],
      queryFn: async () => {
        const hostelId = localStorage.getItem("hostelId");
        if (!hostelId) {
          throw new Error("Hostel ID is not available in local storage.");
        }
        const response = await axios.get(
          `/api/calendar/historical/${hostelId}`
        );
        return response.data;
      },
    });

  const historicalYears = historicalYearsResponse?.data || [];

  const { register, handleSubmit, reset } = useForm<FormValues>();
  const hostelId = localStorage.getItem("hostelId");

  // Mutation for adding calendar year
  const AddCalendarYearMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        name: data.yearName,
        hostelId: hostelId || "",
      };
      await axios.post(`/api/calendar/start`, payload).then((res)=>{
         refectCurrentYear()
      refectHistoricalYears()
      toast.success("Academic Year added successfully");
      reset();
        return res.data
      }).catch((error)=>{
        let errorMessage = "Failed to add Academic Year";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else {
        errorMessage = (error as Error).message || errorMessage;
      }
      toast.error(errorMessage);
      })
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    AddCalendarYearMutation.mutate(data);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <SEOHelmet
      title="Calendar Year Management - Fuse"
      description="Manage your calendar years efficiently with our user-friendly interface. Add, view, and manage historical years seamlessly."
      keywords="calendar year management, academic year, Fuse"
      />
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
  );
};

export default CalendarYear;
