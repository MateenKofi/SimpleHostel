import { useQuery } from "@tanstack/react-query";
import { getCurrentCalendarYear, getHistoricalCalendarYears } from "@/api/calendar";
import AddCalendarYearForm from "@/components/AddCalendarYearFrom";
import CalendarYearTable from "@/components/calendar/CalendarYearTable";
import CalendarYearStats from "@/components/calendar/CalendarYearStats";
import { CalendarYearT } from "@/helper/types/types";
import SEOHelmet from "@/components/SEOHelmet";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { useModal } from "@/components/Modal";

const CalendarYear = () => {
  const AddCalendarYearAction = useModal("add-calendar-year-modal");

  const {
    data: currentYear,
    isLoading: isCurrentYearLoading,
    refetch: refetchCurrentYear,
  } = useQuery<CalendarYearT>({
    queryKey: ["currentYear"],
    queryFn: async () => {
      const hostelId = localStorage.getItem("hostelId");
      if (!hostelId) return null;
      const responseData = await getCurrentCalendarYear(hostelId);
      return responseData?.data;
    },
  });

  const {
    data: historicalYearsResponse,
    isLoading: isHistoricalYearsLoading,
    refetch: refetchHistoricalYears,
  } = useQuery<{ data: CalendarYearT[] }>({
    queryKey: ["historicalYears"],
    queryFn: async () => {
      const hostelId = localStorage.getItem("hostelId");
      if (!hostelId) {
        throw new Error("Hostel ID is not available in local storage.");
      }
      return await getHistoricalCalendarYears(hostelId);
    },
  });

  const historicalYears = historicalYearsResponse?.data || [];

  // Calculate stats
  const activeYearsCount = currentYear?.isActive ? 1 : 0;
  const totalYearsCount = activeYearsCount + historicalYears.length;
  const totalResidents =
    (currentYear?.Residents?.length || 0) +
    historicalYears.reduce((sum, year) => sum + (year.HistoricalResident?.length || 0), 0);

  // Combined refetch function
  const refetchAll = () => {
    refetchCurrentYear();
    refetchHistoricalYears();
  };

  const isLoading = isCurrentYearLoading || isHistoricalYearsLoading;
  const isError = false; // You can add error handling if needed

  return (
    <div className="p-6">
      <SEOHelmet
        title="Calendar Year Management - Fuse"
        description="Manage your calendar years efficiently with our user-friendly interface. Add, view, and manage historical years seamlessly."
        keywords="calendar year management, academic year, Fuse"
      />
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Calendar Year Management</h1>
        </div>
        <Button onClick={() => AddCalendarYearAction.open()}>
          <Plus className="w-4 h-4 mr-2" />
          Start New Year
        </Button>
      </div>

      {/* Add Calendar Year Modal */}
      <AddCalendarYearForm
        onClose={AddCalendarYearAction.close}
        refectCurrentYear={refetchAll}
        refectHistoricalYears={refetchAll}
      />

      {/* Stat Cards */}
      <CalendarYearStats
        activeYearsCount={activeYearsCount}
        totalYearsCount={totalYearsCount}
        totalResidents={totalResidents}
        currentYearName={currentYear?.name}
      />

      {/* Data Table */}
      <CalendarYearTable
        currentYear={currentYear}
        historicalYears={historicalYears}
        isLoading={isLoading}
        isError={isError}
        refetch={refetchAll}
      />
    </div>
  );
};

export default CalendarYear;
