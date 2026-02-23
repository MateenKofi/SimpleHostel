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

  return (
    <div className="min-h-screen bg-muted p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header with Filters */}
        <div className="bg-card rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Calendar Year Report
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive overview of hostel performance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <SelectInput
                label="Select Academic Year"
                placeholder="-- Select Academic Year --"
                options={yearOptions}
                value={selectedYear || undefined}
                onValueChange={setSelectedYear}
                loading={isHistoricalYearsLoading || isCurrentYearLoading}
                disabled={AcademicYears.length === 0}
                containerClassName="w-full sm:w-[200px]"
              />
            </div>
          </div>
        </div>

        {isReportDataLoading ? (
          <DashboardLoading />
        ) : (
          <>
            {/* Status and Period Info */}
            <StatusCards reportData={reportData} />
            {/* Key Metrics */}
            <KeyMetrics reportData={reportData} />
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <MonthlyRevenue reportData={reportData} />
              {/* Payment Methods Chart */}
              <PaymentMethod reportData={reportData} />
            </div>
            {/* Payment Methods Details */}
            <PaymentMethodBreakDown reportData={reportData} />
            {/* Historical Comparison */}
            <HistoricalComparison reportData={reportData} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReport;
