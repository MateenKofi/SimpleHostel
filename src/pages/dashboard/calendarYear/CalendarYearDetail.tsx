import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getCurrentCalendarYear, getHistoricalCalendarYears } from "@/api/calendar";
import { CalendarYearT } from "@/helper/types/types";
import SEOHelmet from "@/components/SEOHelmet";
import { backendRoomTypeToDisplay } from "@/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { Calendar, CalendarClock, Users, BadgeCent, ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import CustomDataTable from "@/components/CustomDataTable";
import moment from "moment";

const CalendarYearDetail = () => {
  const { id } = useParams<{ id: string }>();
  const hostelId = localStorage.getItem("hostelId");

  const {
    data: currentYear,
    isLoading: isCurrentYearLoading,
    refetch: refetchCurrentYear,
  } = useQuery<{ data: CalendarYearT }>({
    queryKey: ["currentYear", hostelId],
    queryFn: async () => {
      if (!hostelId) return null;
      return await getCurrentCalendarYear(hostelId);
    },
    enabled: !!hostelId,
  });

  const {
    data: historicalYearsResponse,
    isLoading: isHistoricalYearsLoading,
    refetch: refetchHistoricalYears,
  } = useQuery<{ data: CalendarYearT[] }>({
    queryKey: ["historicalYears", hostelId],
    queryFn: async () => {
      if (!hostelId) return null;
      return await getHistoricalCalendarYears(hostelId);
    },
    enabled: !!hostelId,
  });

  const historicalYears = historicalYearsResponse?.data || [];

  // Find the calendar year by ID from current and historical years
  const yearData = currentYear?.data?.id === id
    ? currentYear?.data
    : historicalYears.find((year) => year.id === id);

  const isLoading = isCurrentYearLoading || isHistoricalYearsLoading;
  const isError = !yearData;
  const refetch = () => {
    refetchCurrentYear();
    refetchHistoricalYears();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading calendar year details...</p>
        </div>
      </div>
    );
  }

  if (isError || !yearData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md border-2 border-dashed border-border/60 bg-muted/20 rounded-2xl">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Calendar Year Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The calendar year you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const residents = yearData.isActive ? (yearData.residents || []) : (yearData.historicalResidents || []);
  const residentsCount = residents.length;

  // Calculate total revenue from resident payments
  const totalRevenue = residents.reduce((sum, r: any) => {
    const amount = r.amountPaid || 0;
    return sum + (typeof amount === 'number' ? amount : parseFloat(amount || 0));
  }, 0);

  const totalExpenses = yearData.financialReport?.totalExpenses || 0;
  const netIncome = totalRevenue - totalExpenses;

  // Calculate occupancy percentage (assuming residents should have rooms)
  const occupiedRooms = residents.filter((r: any) => r.room).length;
  const occupancyRate = residentsCount > 0 ? Math.round((occupiedRooms / residentsCount) * 100) : 0;

  // Prepare resident data for table
  const residentData = residents.map((r: any) => {
    const amountPaid = r.amountPaid || 0;
    const safeAmount = typeof amountPaid === 'number' ? amountPaid : parseFloat(amountPaid || 0);

    return {
      ...r,
      residentName: r.resident?.user?.name || r.user?.name || "N/A",
      roomNumber: r.room?.roomNumber || r.roomNumber || "N/A",
      roomType: r.room?.type || "N/A",
      checkIn: r.checkInDate ? moment(r.checkInDate).format("MMM DD, YYYY") : "N/A",
      checkOut: r.checkOutDate ? moment(r.checkOutDate).format("MMM DD, YYYY") : "Active",
      amountPaid: safeAmount,
      status: r.status || "Active",
    };
  });

  const columns = [
    {
      name: "Resident Name",
      selector: (row: any) => row.residentName,
      sortable: true,
      grow: 1.5,
    },
    {
      name: "Room Number",
      selector: (row: any) => row.roomNumber,
      sortable: true,
    },
    {
      name: "Room Type",
      selector: (row: any) => backendRoomTypeToDisplay(row.roomType),
      sortable: true,
    },
    {
      name: "Check In",
      selector: (row: any) => row.checkIn,
      sortable: true,
    },
    {
      name: "Check Out",
      selector: (row: any) => row.checkOut,
      sortable: true,
    },
    {
      name: "Amount Paid",
      selector: (row: any) => `GHS${(row.amountPaid || 0).toLocaleString()}`,
      sortable: true,
    },
    {
      name: "Status",
      sortable: true,
      center: true,
      cell: (row: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-center text-nowrap ${
            row.status === "Active"
              ? "bg-forest-green-100 text-forest-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title={`${yearData.name} - Calendar Year Details`}
        description={`View detailed information for ${yearData.name} including residents, statistics, and financial reports.`}
        keywords="calendar year, academic year, hostel management, Fuse"
      />
      <PageHeader
        title={yearData.name}
        subtitle={`Calendar Year Management • ${yearData.isActive ? "Active" : "Ended"}`}
        icon={Calendar}
        sticky={true}
        actions={
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Year Details Card */}
          <Card className="bg-gradient-to-br from-forest-green-50 to-sage-green-50 dark:from-forest-green-950/20 dark:to-sage-green-950/10 border-forest-green-200/50 dark:border-forest-green-800/30">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl md:text-2xl">Year Information</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {yearData.isActive ? "Currently active academic year" : "Historical academic year"}
                  </p>
                </div>
                <Badge
                  variant={yearData.isActive ? "default" : "secondary"}
                  className="px-4 py-1.5 text-sm font-medium"
                >
                  {yearData.isActive ? (
                    <span className="flex items-center gap-1.5">
                      <CalendarClock className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Ended
                    </span>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                  <p className="text-base font-semibold text-foreground">
                    {moment(yearData.startDate).format("MMMM DD, YYYY")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">End Date</p>
                  <p className="text-base font-semibold text-foreground">
                    {yearData.endDate ? moment(yearData.endDate).format("MMMM DD, YYYY") : "Not Ended"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-base font-semibold text-foreground">
                    {yearData.endDate
                      ? `${moment(yearData.endDate).diff(moment(yearData.startDate), "days")} days`
                      : `${moment().diff(moment(yearData.startDate), "days")} days (ongoing)`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Users}
              title="Total Residents"
              content={residentsCount.toString()}
              description={`${yearData.isActive ? "Currently" : "Historically"} enrolled residents`}
            />
            <StatCard
              icon={Calendar}
              title="Occupancy Rate"
              content={`${occupancyRate}%`}
              description="Residents with assigned rooms"
            />
            <StatCard
              icon={BadgeCent}
              title="Total Revenue"
              content={`GHS${(totalRevenue / 1000).toFixed(0)}K`}
              description="Total revenue collected"
            />
            <StatCard
              icon={BadgeCent}
              title="Net Income"
              content={`GHS${(netIncome / 1000).toFixed(0)}K`}
              description={`Revenue minus expenses`}
            />
          </div>

          {/* Financial Summary Card */}
          {(totalRevenue > 0 || totalExpenses > 0) && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <span className="text-lg font-semibold text-forest-green-700">
                      GHS{totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Expenses</span>
                    <span className="text-lg font-semibold text-warm-red-600">
                      GHS{totalExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Net Income</span>
                    <span className={`text-xl font-bold ${netIncome >= 0 ? "text-forest-green-700" : "text-warm-red-600"}`}>
                      GHS{netIncome.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Residents Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">
                {yearData.isActive ? "Current Residents" : "Historical Residents"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CustomDataTable
                title=""
                columns={columns}
                data={residentData}
                isError={false}
                isLoading={false}
                refetch={refetch}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CalendarYearDetail;
