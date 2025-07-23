import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AddCalendarYearForm from "@/components/AddCalendarYearFrom";
import CurrentYearCard from "@/components/CalenderYearCard";
import HistoricalYearsList from "@/components/HistoricalYearsList";
import { CalendarYearT } from "@/helper/types/types";
import HistoricalYearsSkeleton from "@/components/loaders/HIstoricalYearsSkeleton";
import CurrentYearSkeleton from "@/components/loaders/CurrentYearSkeleton";
import SEOHelmet from "@/components/SEOHelmet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useModal } from "@/components/Modal";



const CalendarYear = () => {
  const AddCalendarYearAction = useModal('add-calendar-year-modal');
   
  
  const {
    data: currentYear,
    isLoading: isCurrentYearLoading,
    refetch: refectCurrentYear,
  } = useQuery<CalendarYearT>({
    queryKey: ["currentYear"],
    queryFn: async () => {
      const hostelId = localStorage.getItem("hostelId");
      const response = await axios.get(`/api/calendar/current/${hostelId}`);
      return response?.data?.data;
    },
  });

  const {
    data: historicalYearsResponse,
    isLoading: isHistoricalYearsLoading,
    refetch: refectHistoricalYears,
  } = useQuery<{ data: CalendarYearT[] }>({
    queryKey: ["historicalYears"],
    queryFn: async () => {
      const hostelId = localStorage.getItem("hostelId");
      if (!hostelId) {
        throw new Error("Hostel ID is not available in local storage.");
      }
      const response = await axios.get(`/api/calendar/historical/${hostelId}`);
      return response.data;
    },
  });

 const historicalYears = historicalYearsResponse?.data || [];

  return (
    <div className="container px-4 py-8 mx-auto">
      <SEOHelmet
        title="Calendar Year Management - Fuse"
        description="Manage your calendar years efficiently with our user-friendly interface. Add, view, and manage historical years seamlessly."
        keywords="calendar year management, academic year, Fuse"
      />
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-3xl font-bold">Calendar Year Management</h1>
        <Button
        onClick={() => AddCalendarYearAction.open() }
        >
          <Plus className="w-4 h-4 mr-2" />
          Start New Year
        </Button>
      </div>
      <AddCalendarYearForm
        onClose={ AddCalendarYearAction.close }
        refectCurrentYear={ refectCurrentYear }
        refectHistoricalYears={ refectHistoricalYears }
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
