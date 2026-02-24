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
    <div className="w-full">
      {/* Modern Filter Section */}
      <div className="bg-gradient-to-br from-forest-green-50 to-sage-green-50 dark:from-forest-green-950/20 dark:to-sage-green-950/10 rounded-2xl border border-forest-green-200/50 dark:border-forest-green-800/30 p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-forest-green-500 to-teal-green-600">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  Calendar Year Report
                </h1>
                <p className="text-sm text-muted-foreground">
                  Comprehensive overview of hostel performance
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
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
        <div className="space-y-6">
          {/* Status and Period Info */}
          <StatusCards reportData={reportData} />
          {/* Key Metrics */}
          <KeyMetrics reportData={reportData} />
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
