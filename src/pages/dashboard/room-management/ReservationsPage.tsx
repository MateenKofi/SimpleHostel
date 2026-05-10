"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getReservationsByHostel, confirmReservation, cancelReservation } from "@/api/reservations";
import { getCurrentCalendarYear, getHistoricalCalendarYears, startCalendarYear } from "@/api/calendar";
import { toast } from "sonner";
import type { ReservationDto, CalendarYearDto, RoomDto } from "@/types/dtos";
import {
  Calendar,
  Plus,
  CheckCircle2,
  X,
  CalendarPlus,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
  declined: "bg-orange-100 text-orange-800 border-orange-300",
  fulfilled: "bg-gray-100 text-gray-700 border-gray-300",
};

const statusBadgeColors: Record<string, string> = {
  pending: "bg-amber-200 text-amber-900",
  confirmed: "bg-emerald-200 text-emerald-900",
  cancelled: "bg-red-200 text-red-900",
  declined: "bg-orange-200 text-orange-900",
  fulfilled: "bg-gray-200 text-gray-700",
};

export const ReservationsPage = () => {
  const hostelId = localStorage.getItem("hostelId") || "";

  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "cancelled" | "fulfilled"
  >("all");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewYearDialog, setShowNewYearDialog] = useState(false);
  const [newYearName, setNewYearName] = useState("");

  // Fetch reservations
  const { data: reservationsData, refetch: refetchReservations } = useQuery({
    queryKey: ["reservations", hostelId],
    queryFn: async () => {
      if (!hostelId) return [];
      const response = await getReservationsByHostel(hostelId);
      return response.data || [];
    },
    enabled: !!hostelId,
  });

  // Fetch calendar years
  const { data: currentYear } = useQuery({
    queryKey: ["currentCalendar", hostelId],
    queryFn: async () => {
      if (!hostelId) return null;
      const response = await getCurrentCalendarYear(hostelId);
      return response.data.data;
    },
    enabled: !!hostelId,
  });

  const { data: historicalYears, refetch: refetchYears } = useQuery({
    queryKey: ["historicalCalendarYears", hostelId],
    queryFn: async () => {
      if (!hostelId) return [];
      const response = await getHistoricalCalendarYears(hostelId);
      return response.data.data || [];
    },
    enabled: !!hostelId,
  });

  const availableYears = [currentYear, ...(historicalYears || [])].filter(
    (year): year is CalendarYearDto => !!year
  );

  // Confirm reservation mutation
  const confirmMutation = useMutation({
    mutationFn: async (reservationId: string) => {
      await confirmReservation(reservationId);
      refetchReservations();
    },
    onSuccess: () => {
      toast.success("Reservation confirmed successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to confirm reservation";
      toast.error(errorMessage);
    },
  });

  // Cancel reservation mutation
  const cancelMutation = useMutation({
    mutationFn: async (reservationId: string) => {
      await cancelReservation(reservationId);
      refetchReservations();
    },
    onSuccess: () => {
      toast.success("Reservation cancelled successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to cancel reservation";
      toast.error(errorMessage);
    },
  });

  // Start calendar year mutation
  const startYearMutation = useMutation({
    mutationFn: async (name: string) => {
      await startCalendarYear({ hostelId, name });
    },
    onSuccess: () => {
      toast.success("New calendar year started successfully");
      setShowNewYearDialog(false);
      setNewYearName("");
      refetchYears();
      refetchReservations();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to start calendar year";
      toast.error(errorMessage);
    },
  });

  // Filter reservations
  const filteredReservations = (reservationsData || []).filter(
    (reservation: ReservationDto) => {
      const matchesStatus =
        statusFilter === "all" || reservation.status === statusFilter;
      const matchesYear =
        yearFilter === "all" || !yearFilter || reservation.calendarYearId === yearFilter;
      const matchesSearch =
        !searchQuery ||
        reservation.room?.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.room?.block?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.calendarYear?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesYear && matchesSearch;
    }
  );

  // Handle confirm reservation
  const handleConfirm = (id: string) => {
    confirmMutation.mutate(id);
  };

  // Handle cancel reservation
  const handleCancel = (id: string) => {
    cancelMutation.mutate(id);
  };

  // Handle start new calendar year
  const handleStartYear = () => {
    if (!newYearName.trim()) {
      toast.error("Please enter a year name");
      return;
    }
    startYearMutation.mutate(newYearName);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Reservations
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage room reservations and academic years
              </p>
            </div>

            {/* Create Reservation Button */}
            <Button
              onClick={() => {/* Will open modal later */ }}
              className="bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Reservation
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Total Reservations</CardTitle>
                <CardDescription>All time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {reservationsData?.length || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader>
                <CardTitle>Pending</CardTitle>
                <CardDescription>Awaiting confirmation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-700">
                  {
                    reservationsData?.filter((r) => r.status === "pending")
                      .length || 0
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardHeader>
                <CardTitle>Confirmed</CardTitle>
                <CardDescription>Ready for check-in</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-emerald-700">
                  {
                    reservationsData?.filter((r) => r.status === "confirmed")
                      .length || 0
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardHeader>
                <CardTitle>Calendar Years</CardTitle>
                <CardDescription>Active and historical</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-700">
                  {availableYears.length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | "pending" | "confirmed" | "cancelled" | "fulfilled")}>
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="fulfilled">Fulfilled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="year-filter">Calendar Year</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger id="year-filter">
                      <SelectValue placeholder="All years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {availableYears.map((year: CalendarYearDto) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name}
                          {year.isActive && (
                            <span className="ml-2 text-xs text-emerald-600">
                              (Active)
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-[2]">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by room, resident, or year..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create New Year Button */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Academic Years Management
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage academic years and start new periods
                  </p>
                </div>
                <Button
                  onClick={() => setShowNewYearDialog(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  New Academic Year
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reservations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Reservations</CardTitle>
              <CardDescription>
                {filteredReservations.length} of {reservationsData?.length || 0} reservations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredReservations.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No reservations found</p>
                  <p className="text-sm text-muted-foreground">
                    {statusFilter !== "all" || yearFilter || searchQuery
                      ? "Try adjusting your filters"
                      : "Create your first reservation"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Room
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Resident
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Code
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((reservation) => (
                        <tr
                          key={reservation.id}
                          className={`border-b border-border hover:bg-muted/50 transition-colors ${statusColors[reservation.status] || ""
                            }`}
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {reservation.room?.number || "N/A"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {reservation.room?.type}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {reservation.room?.block && (
                                  <span>Block {reservation.room.block}</span>
                                )}
                                {reservation.room?.floor && (
                                  <span>Floor {reservation.room.floor}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {reservation.resident?.user?.name || reservation.name || "N/A"}
                            {reservation.residentId && (
                              <span className="text-xs text-muted-foreground ml-2">
                                Account holder
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-foreground">
                              {reservation.calendarYear?.name || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                statusBadgeColors[reservation.status] ||
                                "bg-gray-200 text-gray-700"
                              }
                            >
                              {reservation.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm tracking-wider">
                              {reservation.secretCode || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {reservation.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleConfirm(reservation.id)}
                                    disabled={confirmMutation.isPending}
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleCancel(reservation.id)}
                                    disabled={cancelMutation.isPending}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* New Calendar Year Dialog */}
      <AlertDialog open={showNewYearDialog} onOpenChange={setShowNewYearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start New Academic Year</AlertDialogTitle>
            <AlertDialogDescription>
              This will start a new academic year and archive the current active year.
              Make sure all residents have checked out and payments are complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="year-name">Year Name</Label>
              <Input
                id="year-name"
                placeholder="e.g., 2024/2025 Academic Year"
                value={newYearName}
                onChange={(e) => setNewYearName(e.target.value)}
              />
            </div>
            {currentYear && (
              <div className="p-4 bg-amber-50 border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-900">
                  <strong className="block mb-1">
                    Active Year:
                  </strong>
                  {currentYear.name}
                </p>
                <p className="text-xs text-amber-800">
                  Starting a new year will archive this year and move all residents to historical
                  records.
                </p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={startYearMutation.isPending}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={handleStartYear}
                disabled={startYearMutation.isPending || !newYearName.trim()}
              >
                {startYearMutation.isPending ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Start New Year"
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* TODO: Decline Reservation Dialog - needs state and handlers */}
      {/* 
      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent>
          ...
        </AlertDialogContent>
      </AlertDialog>
      */}
    </div>
  );
};

export default ReservationsPage;