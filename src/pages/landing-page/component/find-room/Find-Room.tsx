import { useState, useMemo } from "react";
import { ArrowLeft, FileText, MapPin, Users, Home, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Room } from "@/helper/types/types";
import { useSelectedRoomStore } from "@/stores/useSelectedRoomStore";
import FilterPanel from "@/components/FilterPanel";
import { RoomFilterConfig } from "@/helper/room_filter_config";
import { parseRange } from "@/utils/parseRange";
import FindHostelSkeleton from "@/components/loaders/HostelCardSkeleton";
import CustomeRefetch from "@/components/CustomeRefetch";
import SEOHelmet from "@/components/SEOHelmet";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSelectedCalendarYearStore } from "@/stores/useSelectedCalendarYearStore";
import { useAddedResidentStore } from "@/stores/useAddedResidentStore";
import { useMutation } from "@tanstack/react-query";
import { getHostelRooms } from "@/api/rooms";
import { getResidentAnalytics } from "@/api/analytics";
import { registerResident } from "@/api/residents";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import RoomCard from "@/components/rooms/RoomCard";
import { FilterBar } from "@/components/filters/FilterBar";

interface ActiveFilters {
  [key: string]: string[];
}

const FindRoom = () => {
  const navigate = useNavigate();
  const { id: hostelId } = useParams();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    gender: [],
    priceRange: [],
    roomType: [],
  });

  // Filter panel open state (desktop)
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const { setRoom } = useSelectedRoomStore();
  const { user, token } = useAuthStore();
  const setResident = useAddedResidentStore((state) => state.setResident);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingRoom, setSelectedBookingRoom] = useState<Room | null>(null);
  const calendarYear = useSelectedCalendarYearStore((state) => state.calendarYear);

  const BookingMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedBookingRoom) {
        throw new Error("User or room not found");
      }

      // Try to find existing resident profile first to skip registration
      try {
        const analyticsData = await getResidentAnalytics(user.id);
        const existingResidentId = analyticsData?.data?.residentId;

        if (existingResidentId) {
          // Return a UserDto-like structure for existing residents
          return {
            success: true,
            isExisting: true,
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phoneNumber || undefined,
              role: user.role,
              residentProfile: {
                id: existingResidentId,
                userId: user.id,
                hostelId: selectedBookingRoom.hostelId,
                roomId: selectedBookingRoom.id,
                studentId: null,
                course: null,
                roomNumber: selectedBookingRoom.roomNumber,
                status: "pending",
                checkInDate: null,
                checkOutDate: null,
              }
            }
          } as const;
        }
      } catch {
        console.log("No existing resident profile found or error fetching analytics.");
      }

      // If no existing profile, we must register.
      const payload = {
        name: user.name,
        email: user.email,
        phone: user.phoneNumber || "0240000000",
        gender: selectedBookingRoom.gender.toLowerCase(),
        studentId: "PENDING",
        course: "PENDING",
        emergencyContactName: "PENDING",
        emergencyContactPhone: "0240000000",
        emergencyContactRelationship: "Self",
        hostelId: selectedBookingRoom.hostelId || "",
        calendarYearId: calendarYear?.id || "",
        roomId: selectedBookingRoom.id || ""
      };

      return await registerResident(payload);
    },
    onSuccess: (res: any) => {
      setResident(res?.data || null);

      toast.success(res?.isExisting ? "Ready for payment!" : "Booking initiated successfully!");
      setIsBookingModalOpen(false);
      setTimeout(() => {
        navigate("/payment");
      }, 500);
    },
    onError: (error: { response?: { data?: { message?: string; error?: string } } }) => {
      const msg = error.response?.data?.message || error.response?.data?.error || "Failed to process booking";
      toast.error(msg);
    }
  });

  const {
    data: RoomData,
    isLoading,
    isError,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms", hostelId],
    queryFn: async () => {
      if (!hostelId) return null;
      return await getHostelRooms(hostelId);
    },
  });

  const handleFilterChange = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (updated[category]?.includes(value)) {
        updated[category] = updated[category]?.filter((item) => item !== value);
      } else {
        updated[category] = [...(updated[category] || []), value];
      }
      return updated;
    });
  };

  const availableRooms = useMemo(() => {
    const rooms = RoomData?.rooms || [];
    return rooms.filter((room: Room) => room.status === "available");
  }, [RoomData?.rooms]);

  const filteredRooms = useMemo(() => {
    return availableRooms.filter((room: Room) => {
      const matchesGender =
        activeFilters.gender.length === 0 ||
        activeFilters.gender.includes(room.gender);

      const matchesPriceRange =
        activeFilters.priceRange.length === 0 ||
        activeFilters.priceRange.some((range) => {
          const { min, max } = parseRange(range);
          return room.price >= min && room.price <= max;
        });

      const matchesRoomType =
        activeFilters.roomType.length === 0 ||
        activeFilters.roomType.includes(room.type);

      return matchesGender && matchesPriceRange && matchesRoomType;
    });
  }, [availableRooms, activeFilters]);

  const handleRoomClick = (room: Room) => {
    if (!token || !user) {
      toast.error("Please log in to book a room");
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setRoom(room);
    setSelectedBookingRoom(room);
    setIsBookingModalOpen(true);
  };

  const confirmBooking = () => {
    BookingMutation.mutate();
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      gender: [],
      priceRange: [],
      roomType: [],
    });
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).filter((arr) => arr.length > 0).length;
  }, [activeFilters]);

  if (isLoading) {
    return <FindHostelSkeleton />;
  }

  if (isError) {
    return <CustomeRefetch refetch={refetchRooms} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHelmet
        title="Find Room - Fuse"
        description="Search for the best rooms on Fuse."
        keywords="find room, Fuse, student accommodation"
      />
      <Button
        className="mb-4 bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* Sidebar with FilterBar */}
        <div className="w-full md:w-72 lg:w-80 space-y-4">
          <FilterBar
            activeFilterCount={activeFilterCount}
            onToggleFilters={() => setIsFilterOpen(!isFilterOpen)}
            onClearAll={clearAllFilters}
            isOpen={isFilterOpen}
            className="md:hidden"
          />
          <FilterPanel
            FilterConfig={RoomFilterConfig}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            variant="sidebar"
            isOpen={isFilterOpen}
          />
        </div>

        {/* Rooms Grid */}
        <div className="flex-1 space-y-4">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-lg font-medium text-foreground mb-2">
                No rooms match your filters
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filter options
              </p>
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-2">
                <p className="text-sm text-muted-foreground">
                  {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} available
                </p>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-destructive hover:text-destructive"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room: Room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onBookRoom={handleRoomClick}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row max-h-[90vh] sm:max-h-none overflow-y-auto">
            {/* Left Side - Room Image */}
            <div className="sm:w-2/5 relative aspect-square sm:aspect-auto bg-muted min-h-[250px]">
              <img
                src={selectedBookingRoom?.roomImages?.[0]?.imageUrl || "/logo.png"}
                alt="Room preview"
                className="w-full h-full object-cover"
              />
              {/* Status badge overlay */}
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                Available
              </span>
            </div>

            {/* Right Side - Booking Details */}
            <div className="sm:w-3/5 p-6 space-y-5">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-foreground">Confirm Booking</h2>
                <p className="text-muted-foreground mt-1">
                  Review your room selection before proceeding
                </p>
              </div>

              {/* Room Number Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <Home className="w-4 h-4" />
                <span className="font-semibold">Room {selectedBookingRoom?.roomNumber}</span>
              </div>

              {/* Room Details with Icons */}
              <div className="space-y-3 bg-muted/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">Block {selectedBookingRoom?.block}, Floor {selectedBookingRoom?.floor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BedDouble className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Room Type</p>
                    <p className="font-medium capitalize">{selectedBookingRoom?.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="font-medium">{selectedBookingRoom?.currentResidentCount || 0} / {selectedBookingRoom?.maxCap} residents</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{selectedBookingRoom?.gender}</p>
                  </div>
                </div>
              </div>

              {/* Price Highlight */}
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">Total per semester</p>
                <p className="text-2xl font-bold text-primary">GHS {selectedBookingRoom?.price?.toLocaleString()}</p>
              </div>

              {/* Terms */}
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>By confirming, you agree to the Hostel Rules & Regulations and will be redirected to the payment page.</span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmBooking}
                  disabled={BookingMutation.isPending}
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  {BookingMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : "Confirm & Pay"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindRoom;
