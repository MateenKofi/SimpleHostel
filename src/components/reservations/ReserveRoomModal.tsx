"use client";

import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createReservation, getReservationsByHostel } from "@/api/reservations";
import { getCurrentCalendarYear, getHistoricalCalendarYears } from "@/api/calendar";
import { getHostelResidents } from "@/api/residents";
import { toast } from "sonner";
import type { CalendarYearDto, ResidentDto, ReservationDto } from "@/types/dtos";
import type { Room } from "@/helper/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, AlertCircle, User, Users, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReserveRoomModalProps {
  hostelId: string;
  rooms: Room[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type ResidentMode = "existing" | "new";

export const ReserveRoomModal = ({
  hostelId,
  rooms,
  open,
  onOpenChange,
  onSuccess,
}: ReserveRoomModalProps) => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [residentMode, setResidentMode] = useState<ResidentMode>("existing");
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newResidentDetails, setNewResidentDetails] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "" as "" | "male" | "female" | "other",
  });

  // Fetch calendar years
  const { data: currentYear } = useQuery({
    queryKey: ["currentCalendar", hostelId],
    queryFn: () => getCurrentCalendarYear(hostelId).then((r) => r.data),
    enabled: open && !!hostelId,
  });

  const { data: historicalYears } = useQuery({
    queryKey: ["historicalCalendarYears", hostelId],
    queryFn: () => getHistoricalCalendarYears(hostelId).then((r) => r.data),
    enabled: open && !!hostelId,
  });

  // Fetch reservations for capacity calculation
  const { data: reservationsResponse } = useQuery({
    queryKey: ["reservations", hostelId],
    queryFn: () =>
      getReservationsByHostel(hostelId).then((r) => r.data),
    enabled: open && !!hostelId,
  });

  const reservations = reservationsResponse || [];

  // Fetch residents for existing resident mode
  const { data: residentsData } = useQuery({
    queryKey: ["hostelResidents", hostelId, searchQuery],
    queryFn: () =>
      getHostelResidents(hostelId).then((r) => r.data.data),
    enabled: open && residentMode === "existing" && !!hostelId,
  });

  // Available calendar years (only future historical years that are not started)
  const availableYears = useMemo(() => {
    const years: CalendarYearDto[] = [];
    if (historicalYears) {
      // Include historical years that might be future years (not started yet)
      historicalYears.forEach((year: CalendarYearDto) => {
        if (!year.endDate && !year.isActive && !years.find((y) => y.id === year.id)) {
          years.push(year);
        }
      });
    }
    return years;
  }, [historicalYears]);

  // Calculate room capacity
  const roomCapacity = useMemo(() => {
    if (!selectedRoom || !reservations) return null;

    const room = rooms.find((r) => r.id === selectedRoom);
    if (!room) return null;

    const confirmedReservationsForYear = reservations.filter(
      (r: ReservationDto) =>
        r.roomId === selectedRoom &&
        r.calendarYearId === selectedYear &&
        (r.status === "confirmed" || r.status === "fulfilled")
    ).length;

    const currentOccupants = room.currentResidentCount || 0;
    const totalUsed = currentOccupants + confirmedReservationsForYear;
    const available = room.maxCap - totalUsed;

    return {
      max: room.maxCap,
      currentOccupants,
      confirmedReservations: confirmedReservationsForYear,
      totalUsed,
      available,
      isFull: available <= 0,
    };
  }, [selectedRoom, selectedYear, rooms, reservations]);

  // Filter residents by search query
  const filteredResidents = useMemo(() => {
    if (!residentsData || !residentsData.residents) return [];
    if (!searchQuery.trim()) return residentsData.residents;

    const query = searchQuery.toLowerCase();
    return residentsData.residents.filter((r: ResidentDto) => {
      const name = r.name?.toLowerCase() || "";
      const email = r.email?.toLowerCase() || "";
      const phone = r.phone?.toLowerCase() || "";
      const studentId = r.studentId?.toLowerCase() || "";
      return (
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        studentId.includes(query)
      );
    });
  }, [residentsData, searchQuery]);

  // Create reservation mutation
  const createReservationMutation = useMutation({
    mutationFn: async () => {
      const payload: {
        roomId: string;
        calendarYearId: string;
        residentId?: string;
        name?: string;
        email?: string;
        phone?: string;
        gender?: "male" | "female" | "other";
      } = {
        roomId: selectedRoom,
        calendarYearId: selectedYear,
      };

      if (residentMode === "existing") {
        payload.residentId = selectedResidentId;
      } else {
        payload.name = newResidentDetails.name;
        payload.email = newResidentDetails.email || undefined;
        payload.phone = newResidentDetails.phone || undefined;
        payload.gender = newResidentDetails.gender || undefined;
      }

      return createReservation(payload);
    },
    onSuccess: () => {
      toast.success("Reservation created successfully!");
      handleClose();
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create reservation";
      toast.error(errorMessage);
    },
  });

  const handleClose = () => {
    // Reset state
    setSelectedYear("");
    setSelectedRoom("");
    setResidentMode("existing");
    setSelectedResidentId("");
    setSearchQuery("");
    setNewResidentDetails({ name: "", email: "", phone: "", gender: "" });
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedYear) {
      toast.error("Please select a calendar year");
      return;
    }

    if (!selectedRoom) {
      toast.error("Please select a room");
      return;
    }

    if (residentMode === "existing" && !selectedResidentId) {
      toast.error("Please select a resident");
      return;
    }

    if (residentMode === "new" && !newResidentDetails.name) {
      toast.error("Please enter the resident's name");
      return;
    }

    if (residentMode === "new" && !newResidentDetails.email) {
      toast.error("Please provide the resident's email");
      return;
    }

    if (residentMode === "new" && !newResidentDetails.phone) {
      toast.error("Please provide the resident's phone number");
      return;
    }

    if (residentMode === "new" && !newResidentDetails.gender) {
      toast.error("Please select the resident's gender");
      return;
    }

    createReservationMutation.mutate();
  };

  const selectedRoomData = rooms.find((r) => r.id === selectedRoom);
  const selectedYearData = availableYears.find((y) => y.id === selectedYear);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reserve Room</DialogTitle>
          <DialogDescription>
            Create a room reservation for a resident
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Calendar Year Selection */}
          <div className="space-y-2">
            <Label htmlFor="calendarYear">
              Calendar Year <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger id="calendarYear">
                <SelectValue placeholder="Select calendar year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.name}
                    {year.isActive && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Current)
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Selection */}
          <div className="space-y-2">
            <Label htmlFor="room">
              Room <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedRoom}
              onValueChange={setSelectedRoom}
            >
              <SelectTrigger id="room">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => {
                  const confirmedReservationsForYear = reservations?.filter(
                    (r: ReservationDto) =>
                      r.roomId === room.id &&
                      r.calendarYearId === selectedYear &&
                      r.status === "confirmed"
                  ).length || 0;

                  const totalOccupancy =
                    (room.currentResidentCount || 0) +
                    confirmedReservationsForYear;

                  return (
                    <SelectItem key={room.id} value={room.id}>
                      <div className="flex items-center gap-2">
                        <span>{room.number}</span>
                        <span className="text-xs text-muted-foreground">
                          ({room.type}, {room.gender})
                        </span>
                        <span className="ml-auto text-xs">
                          {totalOccupancy}/{room.maxCap}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Room Capacity Display */}
            {selectedRoomData && (
              <Alert
                className={`mt-2 ${roomCapacity?.isFull
                    ? "bg-red-50 border-red-200"
                    : roomCapacity?.available === 1
                      ? "bg-amber-50 border-amber-200"
                      : "bg-emerald-50 border-emerald-200"
                  }`}
              >
                <Users className={`w-4 h-4 ${roomCapacity?.isFull ? "text-red-600" : "text-emerald-600"
                  }`} />
                <AlertDescription
                  className={`text-sm ${roomCapacity?.isFull ? "text-red-900" : "text-emerald-900"
                    }`}
                >
                  <div className="font-medium mb-1">
                    {roomCapacity?.isFull
                      ? "Room is full"
                      : `${roomCapacity?.available} spot(s) available`}
                  </div>
                  <div className="text-xs opacity-90">
                    Current occupants: {roomCapacity?.currentOccupants} |{" "}
                    Confirmed reservations: {roomCapacity?.confirmedReservations} |{" "}
                    Total: {roomCapacity?.totalUsed}/{roomCapacity?.max}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Resident Selection */}
          <div className="space-y-3">
            <Label>Resident</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={residentMode === "existing" ? "default" : "outline"}
                onClick={() => setResidentMode("existing")}
                className="flex-1"
              >
                <User className="w-4 h-4 mr-2" />
                Existing Resident
              </Button>
              <Button
                type="button"
                variant={residentMode === "new" ? "default" : "outline"}
                onClick={() => setResidentMode("new")}
                className="flex-1"
              >
                <User className="w-4 h-4 mr-2" />
                New Resident
              </Button>
            </div>

            {residentMode === "existing" ? (
              <div className="space-y-2">
                <Input
                  placeholder="Search residents by name, email, phone, or student ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {filteredResidents && filteredResidents.length > 0 ? (
                  <Select
                    value={selectedResidentId}
                    onValueChange={setSelectedResidentId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a resident" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredResidents.map((resident: ResidentDto) => (
                        <SelectItem key={resident.id} value={resident.id}>
                          <div className="flex flex-col">
                            <span>{resident.name}</span>
                            {resident.studentId && (
                              <span className="text-xs text-muted-foreground">
                                {resident.studentId}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    {searchQuery
                      ? "No residents found matching your search"
                      : "Loading residents..."}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="newResidentName">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="newResidentName"
                    placeholder="Full name"
                    value={newResidentDetails.name}
                    onChange={(e) =>
                      setNewResidentDetails({
                        ...newResidentDetails,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="newResidentEmail">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="newResidentEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={newResidentDetails.email}
                      onChange={(e) =>
                        setNewResidentDetails({
                          ...newResidentDetails,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newResidentPhone">
                      Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="newResidentPhone"
                      placeholder="024XXXXXXX"
                      value={newResidentDetails.phone}
                      onChange={(e) =>
                        setNewResidentDetails({
                          ...newResidentDetails,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newResidentGender">
                    Gender <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={newResidentDetails.gender}
                    onValueChange={(val) =>
                      setNewResidentDetails({
                        ...newResidentDetails,
                        gender: val as "male" | "female" | "other",
                      })
                    }
                  >
                    <SelectTrigger id="newResidentGender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-900">
                    The new resident can use the reservation code provided after
                    registration to claim this reservation.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Summary */}
          {(selectedRoomData || selectedYearData) && (
            <Alert className="bg-muted/50">
              <Home className="w-4 h-4" />
              <AlertDescription className="text-sm">
                Reservation for{" "}
                <strong>
                  {selectedYearData?.name || "selected year"}
                </strong>{" "}
                -{" "}
                <strong>
                  Room {selectedRoomData?.number || "selected room"}
                </strong>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createReservationMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createReservationMutation.isPending ||
                roomCapacity?.isFull ||
                !selectedYear ||
                !selectedRoom ||
                (residentMode === "existing" && !selectedResidentId) ||
                (residentMode === "new" &&
                  (!newResidentDetails.name ||
                    !newResidentDetails.email ||
                    !newResidentDetails.phone ||
                    !newResidentDetails.gender))
              }
            >
              {createReservationMutation.isPending ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Reservation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};