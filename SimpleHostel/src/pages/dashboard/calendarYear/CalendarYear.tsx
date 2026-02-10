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
import { PageHeader } from "@/components/layout/PageHeader";

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
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Calendar Year Management - Fuse"
        description="Manage your calendar years efficiently with our user-friendly interface. Add, view, and manage historical years seamlessly."
        keywords="calendar year management, academic year, Fuse"
      />
      <PageHeader
        title="Calendar Year Management"
        subtitle="Manage academic calendar years and track resident history"
        icon={Calendar}
        actions={
          <Button size="sm" onClick={() => AddCalendarYearAction.open()}>
            <Plus className="w-4 h-4 mr-2" />
            Start New Year
          </Button>
        }
      />

      {/* Add Calendar Year Modal */}
      <AddCalendarYearForm
        onClose={AddCalendarYearAction.close}
        refectCurrentYear={refetchAll}
        refectHistoricalYears={refetchAll}
      />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
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
      </main>
    </div>
  );
};

export default CalendarYear;
