import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getCurrentCalendarYear, getHistoricalCalendarYears } from "@/api/calendar";
import AddCalendarYearForm from "@/components/AddCalendarYearFrom";
import CalendarYearTable from "@/components/calendar/CalendarYearTable";
import CalendarYearStats from "@/components/calendar/CalendarYearStats";
import CalendarYearSkeleton from "@/components/loaders/CalendarYearLoader";
import { CalendarYearT } from "@/helper/types/types";
import SEOHelmet from "@/components/SEOHelmet";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { useModal } from "@/components/Modal";
import { PageHeader } from "@/components/layout/PageHeader";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

const CalendarYear = () => {
  const AddCalendarYearAction = useModal("add-calendar-year-modal");

  const {
    data: currentYear,
    isLoading: isCurrentYearLoading,
    isError: isCurrentYearError,
    refetch: refetchCurrentYear,
  } = useQuery<CalendarYearT>({
    queryKey: ["currentYear"],
    queryFn: async () => {
      const hostelId = localStorage.getItem("hostelId");
if (!hostelId) return null;
      const responseData = await getCurrentCalendarYear(hostelId);
      return responseData?.data;
    },
    retry: 1,
  });

  const {
    data: historicalYearsResponse,
    isLoading: isHistoricalYearsLoading,
    isError: isHistoricalError,
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
    retry: 1,
  });

  const historicalYears = historicalYearsResponse?.data || [];

  const activeYearsCount = currentYear?.isActive ? 1 : 0;
  const totalYearsCount = activeYearsCount + historicalYears.length;
  const totalResidents = currentYear?.residents?.length || 0;

  const refetchAll = () => {
    refetchCurrentYear();
    refetchHistoricalYears();
  };

  const isLoading = isCurrentYearLoading || isHistoricalYearsLoading;
  const isError = isCurrentYearError || isHistoricalError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SEOHelmet
          title="Calendar Year Management - Fuse"
          description="Manage your calendar years efficiently with our user-friendly interface. Add, view, and manage historical years seamlessly."
          keywords="calendar year management, academic year, Fuse"
        />
        <CalendarYearSkeleton />
      </div>
    );
  }

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
        sticky={true}
        actions={
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="sm"
              onClick={() => AddCalendarYearAction.open()}
              className="transition-colors duration-200 hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start New Year
            </Button>
          </motion.div>
        }
      />

      <AddCalendarYearForm
        onClose={AddCalendarYearAction.close}
        refectCurrentYear={refetchAll}
        refectHistoricalYears={refetchAll}
      />

      <main className="flex-1 p-4 md:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-6"
        >
          <motion.div variants={itemVariants}>
            <CalendarYearStats
              activeYearsCount={activeYearsCount}
              totalYearsCount={totalYearsCount}
              totalResidents={totalResidents}
              currentYearName={currentYear?.name}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <CalendarYearTable
              currentYear={currentYear}
              historicalYears={historicalYears}
              isLoading={isLoading}
              isError={isError}
              refetch={refetchAll}
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CalendarYear;
