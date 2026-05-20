import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHostels } from "@/api/hostels";
import { getCurrentCalendarYear, getHistoricalCalendarYears } from "@/api/calendar";
import { getCalendarYearReport } from "@/api/analytics";
import { Hostel } from "@/helper/types/types";
import { DashboardLoading } from "../loaders/DashboardLoader";
import CustomeRefetch from "../CustomRefetch";
import MonthlyRevenue from "./charts/MonthlyRevenue";
import PaymentMethod from "./charts/PaymentMethod";
import PaymentMethodBreakDown from "./PaymentMethodBreakDown";
import HistoricalComparison from "./HistoricalComparison";
import StatusCards from "./StatusCards";
import KeyMetrics from "./KeyMetrics";
import { SelectInput, type SelectOption } from "@/components/form";
import { BarChart3 } from "lucide-react";

const SuperAdminReport = () => {
  const [selectedYear, setSelectedYear] = useState(null as string | null);
  const [selectedHostel, setSelectedHostel] = useState(null as string | null);

  const {
    data: Hostels,
    isLoading: isHostelsLoading,
    isError: isHostelsError,
    refetch: refetchHostels,
  } = useQuery({
    queryKey: ["hostels"],
    queryFn: async () => {
      const responseData = await getHostels();
      return responseData.data;
    },
  });

  const {
    data: currentYear,
    isLoading: isCurrentYearLoading,
    isError: isCurrentYearError,
    refetch: refetchCurrentYear,
  } = useQuery({
    queryKey: ["currentYear", selectedHostel],
    queryFn: async () => {
      if (!selectedHostel) return null;
      try {
        const responseData = await getCurrentCalendarYear(selectedHostel);
        return responseData.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!selectedHostel,
  });

  const {
    data: historicalYears,
    isLoading: isHistoricalYearsLoading,
    isError: isHistoricalYearsError,
    refetch: refetchHistoricalYears,
  } = useQuery({
    queryKey: ["historicalYears", selectedHostel],
    queryFn: async () => {
      if (!selectedHostel) return null;
      try {
        const responseData = await getHistoricalCalendarYears(selectedHostel);
        return responseData.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return { data: [] };
        }
        throw error;
      }
    },
    enabled: !!selectedHostel,
  });

  const {
    data: reportData,
    isLoading: isReportDataLoading,
    isError: isReportDataError,
    refetch: refetchReportData,
  } = useQuery({
    queryKey: ["reportData", selectedYear, selectedHostel],

    queryFn: async () => {
      if (!selectedYear && !selectedHostel) return null;
      const responseData = await getCalendarYearReport(selectedHostel!, selectedYear!);
      return responseData.data;
    },
    enabled: !!selectedYear && !!selectedHostel,
  });

  const AcademicYears = [
    ...(historicalYears || []),
    ...(currentYear ? [currentYear] : []),
  ].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  useEffect(() => {
    if (selectedHostel && currentYear?.id && !selectedYear) {
      setSelectedYear(currentYear.id);
    }
  }, [selectedHostel, currentYear]);

  const hasCalendarYears = AcademicYears.length > 0;

  if (
    isHostelsError || isCurrentYearError || isHistoricalYearsError || isReportDataError
  ) {
    return (
      <CustomeRefetch
        refetch={() => {
          refetchHostels();
          refetchCurrentYear();
          refetchHistoricalYears();
          refetchReportData();
        }}
      />
    );
  }

  const hostelOptions: SelectOption[] = ((Hostels || []) as Hostel[])
    .filter(hostel => hostel && hostel.id)
    .map((hostel) => ({
      value: hostel.id,
      label: hostel.name || "Unnamed Hostel",
    }));
  
  const yearOptions: SelectOption[] = AcademicYears
    .filter(year => year && year.id)
    .map((year) => ({
      value: year.id,
      label: year.name || "Unnamed Year",
    }));

  // Empty state when no hostel is selected
  if (!isReportDataLoading && !selectedHostel && hostelOptions.length > 0) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md border-2 border-dashed border-border/60 hover:border-primary/60 bg-muted/20 rounded-2xl transition-all duration-300">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-forest-green-50 to-sage-green-50 dark:from-forest-green-950/20 dark:to-sage-green-950/10 mb-6">
            <BarChart3 className="h-10 w-10 text-forest-green-600 dark:text-forest-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Select a Hostel
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
            Choose a hostel to view its performance reports
          </p>
          <SelectInput
            placeholder="Select Hostel"
            options={hostelOptions}
            value={undefined}
            onValueChange={(val) => {
              setSelectedHostel(val);
              setSelectedYear(null);
            }}
            loading={isHostelsLoading}
            disabled={!Hostels || Hostels.length === 0}
            containerClassName="w-full sm:w-[280px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Modern Filter Section */}
      <div className="bg-gradient-to-br from-forest-green-50 to-sage-green-50 dark:from-forest-green-950/20 dark:to-sage-green-950/10 rounded-2xl border border-forest-green-200/50 dark:border-forest-green-800/30 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-forest-green-500 to-teal-green-600 shrink-0">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
                  Calendar Year Report
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  Comprehensive overview of hostel performance
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto">
            <div className="flex-1 sm:flex-none">
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Hostel
              </label>
              <SelectInput
                placeholder="Choose hostel..."
                options={hostelOptions}
                value={selectedHostel || undefined}
                onValueChange={(val) => {
                  setSelectedHostel(val);
                  setSelectedYear(null);
                }}
                loading={isHostelsLoading}
                disabled={!Hostels || Hostels.length === 0}
                containerClassName="w-full sm:w-[200px]"
              />
            </div>
            {selectedHostel && (
              <div className="flex-1 sm:flex-none">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Academic Year
                </label>
                <SelectInput
                  placeholder="Choose year..."
                  options={yearOptions}
                  value={selectedYear || undefined}
                  onValueChange={setSelectedYear}
                  loading={isHistoricalYearsLoading || isCurrentYearLoading}
                  disabled={AcademicYears.length === 0}
                  containerClassName="w-full sm:w-[220px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isReportDataLoading ? (
        <DashboardLoading />
      ) : (
        <div className="space-y-4 md:space-y-6">
          {/* Status and Period Info */}
          <StatusCards reportData={reportData} />
          {/* Key Metrics */}
          <KeyMetrics reportData={reportData} />
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <MonthlyRevenue reportData={reportData} />
            <PaymentMethod reportData={reportData} />
          </div>
          {/* Payment Methods Details */}
          <PaymentMethodBreakDown reportData={reportData} />
          {/* Historical Comparison */}
          <HistoricalComparison reportData={reportData} />
        </div>
      )}
    </div>
  );
};

export default SuperAdminReport;
