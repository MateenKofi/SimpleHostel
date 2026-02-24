import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentCalendarYear, getHistoricalCalendarYears } from "@/api/calendar";
import { getCalendarYearReport } from "@/api/analytics";
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

const AdminReport = () => {
  const [selectedYear, setSelectedYear] = useState(null as string | null);

  const hostelId = localStorage.getItem("hostelId");


  const {
    data: currentYear,
    isLoading: isCurrentYearLoading,
    isError: isCurrentYearError,
    refetch: refetchCurrentYear,
  } = useQuery({
    queryKey: ["currentYear", hostelId],
    queryFn: async () => {
      if (!hostelId) return null;
      const responseData = await getCurrentCalendarYear(hostelId);
      return responseData.data;
    },
    enabled: !!hostelId,
  });

  const {
    data: historicalYears,
    isLoading: isHistoricalYearsLoading,
    isError: isHistoricalYearsError,
    refetch: refetchHistoricalYears,
  } = useQuery({
    queryKey: ["historicalYears", hostelId],
    queryFn: async () => {
      if (!hostelId) return null;
      const responseData = await getHistoricalCalendarYears(hostelId);
      return responseData.data;
    },
    enabled: !!hostelId,
  });

  const {
    data: reportData,
    isLoading: isReportDataLoading,
    isError: isReportDataError,
    refetch: refetchReportData,
  } = useQuery({
    queryKey: ["reportData", selectedYear, hostelId],

    queryFn: async () => {
      if (!selectedYear && !hostelId) return null;
      const responseData = await getCalendarYearReport(hostelId!, selectedYear!);
      return responseData.data;
    },
    enabled: !!selectedYear && !!hostelId,
  });

  const AcademicYears = [
    ...(historicalYears || []),
    ...(currentYear ? [currentYear] : []),
  ].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  if (
    isCurrentYearError || isHistoricalYearsError || isReportDataError
  ) {
    return (
      <CustomeRefetch
        refetch={() => {
          refetchCurrentYear();
          refetchHistoricalYears();
          refetchReportData();
        }}
      />
    );
  }

  const yearOptions: SelectOption[] = AcademicYears.map((year) => ({
    value: year?.id || "",
    label: year?.name || "",
  }));

  // Empty state when no year is selected
  if (!isReportDataLoading && !selectedYear && AcademicYears.length > 0) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-forest-green-50 to-sage-green-50 dark:from-forest-green-950/20 dark:to-sage-green-950/10 mb-6">
            <BarChart3 className="h-10 w-10 text-forest-green-600 dark:text-forest-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Select Academic Year
          </h2>
          <p className="text-muted-foreground mb-6">
            Choose an academic year to view comprehensive performance reports
          </p>
          <SelectInput
            placeholder="Select Academic Year"
            options={yearOptions}
            value={undefined}
            onValueChange={setSelectedYear}
            loading={isHistoricalYearsLoading || isCurrentYearLoading}
            disabled={AcademicYears.length === 0}
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
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-forest-green-500 to-teal-green-600">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
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
            {/* Monthly Revenue Chart */}
            <MonthlyRevenue reportData={reportData} />
            {/* Payment Methods Chart */}
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

export default AdminReport;
