import { useState } from "react";
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
      const responseData = await getCurrentCalendarYear(selectedHostel);
      return responseData.data;
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
      const responseData = await getHistoricalCalendarYears(selectedHostel);
      return responseData.data;
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

  const hostelOptions: SelectOption[] = ((Hostels || []) as Hostel[]).map((hostel) => ({
    value: hostel?.id || "",
    label: hostel?.name || "",
  }));

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
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <SelectInput
                label="Select Hostel"
                placeholder="-- Select Hostel --"
                options={hostelOptions}
                value={selectedHostel || undefined}
                onValueChange={(val) => {
                  setSelectedHostel(val);
                  setSelectedYear(null); // Reset year when hostel changes
                }}
                loading={isHostelsLoading}
                disabled={!Hostels || Hostels.length === 0}
                containerClassName="w-full sm:w-[180px]"
              />
              {selectedHostel && (
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
              )}
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

export default SuperAdminReport;
