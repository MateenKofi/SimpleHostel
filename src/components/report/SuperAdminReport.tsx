import { useState } from "react";
import {
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHostels } from "@/api/hostels";
import { getCurrentCalendarYear, getHistoricalCalendarYears } from "@/api/calendar";
import { getCalendarYearReport } from "@/api/analytics";
import { Hostel } from "@/helper/types/types";
import { DashboardLoading } from "../loaders/DashboardLoader";
import CustomeRefetch from "../CustomeRefetch";
import MonthlyRevenue from "./charts/MonthlyRevenue";
import PaymentMethod from "./charts/PaymentMethod";
import PaymentMethodBreakDown from "./PaymentMethodBreakDown";
import HistoricalComparison from "./HistoricalComparison";
import StatusCards from "./StatusCards";
import KeyMetrics from "./KeyMetrics";

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Calendar Year Report
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive overview of hostel performance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-col">
                <label
                  htmlFor="hostel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Hostel
                </label>
                <select
                  id="hostel"
                  value={selectedHostel || ""}
                  onChange={(e) => setSelectedHostel(e.target.value)}
                  className="mt-1 block w-[180px] pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {isHostelsLoading ? (
                    <option value="" disabled>
                      Loading hostels...
                    </option>
                  ) : (
                    <>
                      <option value="">-- Select Hostel --</option>
                      {Hostels?.map((hostel: Hostel) => (
                        <option key={hostel?.id} value={hostel?.id}>
                          {hostel?.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              {selectedHostel && (
                <div className="flex flex-col">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Academic Year
                  </label>
                  {isHistoricalYearsLoading || isCurrentYearLoading ? (
                    <span className="text-gray-500 w-[200px] flex flex-row items-center gap-2">
                      {" "}
                      <Loader2 className="animate-spin text-blue-600" />{" "}
                      <span className="">Loading years...</span>
                    </span>
                  ) : (
                    <select
                      disabled={AcademicYears.length === 0}
                      id="year"
                      value={selectedYear || ""}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="mt-1 block w-[200px] pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">-- Select Academic Year --</option>
                      {AcademicYears.map((year) => (
                        <option key={year?.id} value={year?.id}>
                          {year?.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
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
