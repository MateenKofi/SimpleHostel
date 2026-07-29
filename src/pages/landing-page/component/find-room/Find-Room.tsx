import { useState, useMemo } from "react";
import { ArrowLeft, FileText, MapPin, Users, Home, BedDouble, Map, Search, ArrowUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Room } from "@/helper/types/types";
import { useSelectedRoomStore } from "@/stores/useSelectedRoomStore";
import FilterPanel from "@/components/FilterPanel";
import { RoomFilterConfig } from "@/helper/room_filter_config";
import { backendRoomTypeToDisplay } from "@/utils";
import { useDebounce } from "@/hooks";
import FindHostelSkeleton from "@/components/loaders/HostelCardSkeleton";
import CustomeRefetch from "@/components/CustomRefetch";
import SEOHelmet from "@/components/SEOHelmet";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAddedResidentStore } from "@/stores/useAddedResidentStore";
import { useMutation } from "@tanstack/react-query";
import { getHostelRooms } from "@/api/rooms";
import { getResidentAnalytics } from "@/api/analytics";
import { getResidentById } from "@/api/residents";
import type { UserDto, ResidentDto } from "@/types/dtos";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import RoomCard from "@/components/rooms/RoomCard";
import { FilterBar } from "@/components/filters/FilterBar";
import { ActiveFilterChips } from "@/components/filters/ActiveFilterChips";
import { SingleHostelMap } from "@/components/maps/HostelMap";
import { TextInput, SelectInput } from "@/components/form";

interface ActiveFilters {
  [key: string]: string[];
}

const FindRoom = () => {
  const navigate = useNavigate();
  const { id: hostelId } = useParams();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    gender: [],
    roomType: [],
  });

  // Filter panel open state (desktop)
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const { setRoom } = useSelectedRoomStore();
  const { user, token } = useAuthStore();
  const setResident = useAddedResidentStore((state) => state.setResident);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingRoom, setSelectedBookingRoom] = useState<Room | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [sortBy, setSortBy] = useState<"price" | "roomNumber" | "capacity">("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Get user's gender for filtering - use user.gender directly from auth store
  const userGender = user?.gender?.toLowerCase();

  const BookingMutation = useMutation({
    mutationFn: async (): Promise<{ data: UserDto | ResidentDto }> => {
      if (!user || !selectedBookingRoom) {
        throw new Error("User or room not found");
      }

      const analyticsData = await getResidentAnalytics(user.id);
      const residentId = analyticsData?.data?.residentId;
      if (!residentId) {
        throw new Error("Please complete your resident profile before booking.");
      }

      const residentRes = await getResidentById(residentId);
      const resident = residentRes?.data;

      return {
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "resident" | "staff" | "admin" | "super_admin",
          phone: user.phoneNumber || null,
          gender: resident?.gender ?? null,
          avatar: null,
          imageUrl: null,
          accountStatus: "active",
          hostelId: selectedBookingRoom.hostelId || null,
          adminProfile: null,
          staffProfile: null,
          residentProfile: {
            id: residentId,
            hostelId: selectedBookingRoom.hostelId || null,
            roomId: selectedBookingRoom.id || null,
            studentId: resident?.studentId ?? null,
            course: resident?.course ?? null,
            roomNumber: selectedBookingRoom.roomNumber || null,
            status: resident?.status || "pending",
            checkInDate: resident?.checkInDate ?? null,
            checkOutDate: resident?.checkOutDate ?? null,
            hostel: null,
            room: null,
          },
          superAdminProfile: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    },
    onSuccess: (res) => {
      setResident(res?.data || null);

      toast.success("Booking initiated successfully!");
      setIsBookingModalOpen(false);
      setTimeout(() => {
        navigate("/payment");
      }, 500);
    },
    onError: (error: { response?: { data?: { message?: string; error?: string } }; message?: string }) => {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to process booking";
      toast.error(msg);
    },
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

  const handleFilterChange = (category: string, value: string, replace?: boolean) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (replace) {
        updated[category] = [value];
      } else if (updated[category]?.includes(value)) {
        updated[category] = updated[category]?.filter((item) => item !== value);
      } else {
        updated[category] = [...(updated[category] || []), value];
      }
      return updated;
    });
  };

  const availableRooms = useMemo(() => {
    const rooms = RoomData?.rooms || [];
    return rooms.filter(
      (room: Room) => room.effectiveStatus === "available"
    );
  }, [RoomData?.rooms]);

  const filteredRooms = useMemo(() => {
    return availableRooms
      .filter((room: Room) => {
        // UI Filter: Gender (case-insensitive)
        const matchesGender =
          activeFilters.gender.length === 0 ||
          activeFilters.gender.some((g) => g.toLowerCase() === room.gender.toLowerCase());

        // UI Filter: Room Type (case-insensitive)
        const matchesRoomType =
          activeFilters.roomType.length === 0 ||
          activeFilters.roomType.some((t) => t.toLowerCase() === room.type.toLowerCase());

        // Search filter: match room number, block, or floor
        const matchesSearch =
          !debouncedQuery ||
          (room.roomNumber?.toLowerCase() || "").includes(debouncedQuery.toLowerCase()) ||
          (room.block?.toLowerCase() || "").includes(debouncedQuery.toLowerCase()) ||
          (room.floor?.toString() || "").includes(debouncedQuery.toLowerCase());

        return matchesGender && matchesRoomType && matchesSearch;
      })
      .sort((a: Room, b: Room) => {
        let comparison = 0;
        if (sortBy === "price") {
          comparison = a.price - b.price;
        } else if (sortBy === "roomNumber") {
          comparison = (a.roomNumber || "").localeCompare(b.roomNumber || "", undefined, { numeric: true });
        } else if (sortBy === "capacity") {
          comparison = a.maxCap - b.maxCap;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [availableRooms, activeFilters, debouncedQuery, sortBy, sortOrder]);

  const handleRoomClick = (room: Room) => {
    if (!token || !user) {
      toast.error("Please log in to book a room");
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // VALIDATION: Ensure gender compatibility before booking
    if (userGender) {
      const roomGender = room.gender.toLowerCase();
      if (roomGender !== "mix" && roomGender !== userGender) {
        toast.error(`This room is designated for ${room.gender} residents only. You cannot book it.`);
        return;
      }
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
      roomType: [],
    });
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).filter((arr) => arr.length > 0).length;
  }, [activeFilters]);

  // Whether the current user is allowed to book a given room (gender rule).
  // Logged-out users can attempt to book (login flow handles the rest).
  const isRoomBookable = (room: Room) => {
    if (!userGender) return true;
    const rg = room.gender.toLowerCase();
    return rg === "mix" || rg === userGender;
  };

  if (isLoading) {
    return <FindHostelSkeleton />;
  }

  if (isError) {
    return <CustomeRefetch refetch={refetchRooms} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHelmet
        title="Find Room - Best Suit"
        description="Search for the best rooms on Best Suit."
        keywords="find room, Best Suit, student accommodation"
      />
      <Button
        className="mb-4 bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      {/* Hostel Identity Header */}
      {RoomData?.name && (
        <div className="mb-6 flex items-center gap-4 bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center border shrink-0">
            {RoomData.logoUrl ? (
              <img src={RoomData.logoUrl} alt={RoomData.name} className="w-full h-full object-cover" />
            ) : (
              <Home className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">{RoomData.name}</h1>
            {RoomData.location && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{RoomData.location}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hostel Map Section */}
      {RoomData && RoomData.latitude && RoomData.longitude && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Location</h2>
          </div>
          <SingleHostelMap
            hostel={RoomData}
            height="300px"
          />
        </div>
      )}

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
          {/* Search and Sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <TextInput
              placeholder="Search room number, block, floor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={Search}
              containerClassName="flex-1"
            />
            <SelectInput
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [sort, order] = value.split("-");
                setSortBy(sort as "price" | "roomNumber" | "capacity");
                setSortOrder(order as "asc" | "desc");
              }}
              options={[
                { value: "price-asc", label: "Price (Low to High)" },
                { value: "price-desc", label: "Price (High to Low)" },
                { value: "roomNumber-asc", label: "Room Number (A-Z)" },
                { value: "roomNumber-desc", label: "Room Number (Z-A)" },
                { value: "capacity-asc", label: "Capacity (Low to High)" },
                { value: "capacity-desc", label: "Capacity (High to Low)" },
              ]}
              placeholder="Sort by"
              leftIcon={ArrowUpDown}
              containerClassName="w-full sm:w-48"
            />
          </div>

          {/* Active filter chips inline */}
          {activeFilterCount > 0 && (
            <ActiveFilterChips
              filters={(() => {
                const chips: Array<{ category: string; value: string; label: string }> = [];
                Object.entries(activeFilters).forEach(([category, values]) => {
                  values.forEach((value) => {
                    chips.push({ category, value, label: value });
                  });
                });
                return chips;
              })()}
              onRemove={handleFilterChange}
              onClearAll={clearAllFilters}
            />
          )}

          {filteredRooms.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              {activeFilterCount > 0 ? (
                <>
                  <p className="text-lg font-medium text-foreground mb-2">
                    No rooms match your filters
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting your filter options
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    Clear All Filters
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-foreground mb-2">
                    This hostel currently has no available rooms
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please check back later or browse another hostel
                  </p>
                </>
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
                    bookable={isRoomBookable(room)}
                    onBookRoom={handleRoomClick}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row overflow-y-auto flex-1">
            {/* Left Side - Room Image */}
            <div className="sm:w-2/5 relative aspect-square sm:aspect-auto bg-muted min-h-[200px] sm:min-h-full flex-shrink-0">
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
            <div className="sm:w-3/5 p-5 sm:p-6 space-y-4 sm:space-y-5">
              {/* Header */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Confirm Booking</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Review your room selection before proceeding
                </p>
              </div>

              {/* Room Number Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full">
                <Home className="w-4 h-4" />
                <span className="font-semibold text-sm">Room {selectedBookingRoom?.roomNumber}</span>
              </div>

              {/* Room Details with Icons */}
              <div className="space-y-3 bg-muted/50 p-3 sm:p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium text-sm">Block {selectedBookingRoom?.block}, Floor {selectedBookingRoom?.floor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BedDouble className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Room Type</p>
                    <p className="font-medium text-sm">{backendRoomTypeToDisplay(selectedBookingRoom?.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="font-medium text-sm">{selectedBookingRoom?.currentResidentCount || 0} / {selectedBookingRoom?.maxCap} residents</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium text-sm capitalize">{selectedBookingRoom?.gender}</p>
                  </div>
                </div>
              </div>

              {/* Price Highlight */}
              <div className="bg-primary/5 border border-primary/20 p-3 sm:p-4 rounded-xl">
                <p className="text-xs sm:text-sm text-muted-foreground">Total per semester</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">GHS {selectedBookingRoom?.price?.toLocaleString()}</p>
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
