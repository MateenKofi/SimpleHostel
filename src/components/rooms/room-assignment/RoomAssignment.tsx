import { useMemo, useState } from "react";
import {
  Filter,
  X,
  HomeIcon as House,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHostelRooms } from "@/api/rooms";
import RoomAssignmentLoader from "../../loaders/RoomAssignmentLoader";
import { Room } from "../../../helper/types/types";
import CustomeRefetch from "@/components/CustomRefetch";
import { useQuery } from "@tanstack/react-query";
import { useSelectedRoomStore } from "@/stores/useSelectedRoomStore";
import RoomCard from "@/components/rooms/RoomCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Filters {
  type: string;
  gender: string;
  priceRange: string;
  block: string;
  minOccupancy: string;
}

const RoomAssignment = () => {
  const navigate = useNavigate();
  const setRoom = useSelectedRoomStore((state) => state.setRoom);

  const hostelId = localStorage.getItem("hostelId") || "";

  // Fetch rooms data
  const { data: Rooms, isLoading, isError, refetch: refetchRooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      return await getHostelRooms(hostelId);
    },
    enabled: !!hostelId,
  });

  // Filter state
  const [filters, setFilters] = useState<Filters>({
    type: "all",
    gender: "all",
    priceRange: "all",
    block: "all",
    minOccupancy: "all",
  });

  // Transform the API data to match the Room interface and filter available rooms
  const availableRooms = useMemo(() => {
    const rooms = Rooms?.rooms || [];
    return rooms.filter((room: Room) => room.status === "available");
  }, [Rooms?.rooms]);

  // Get unique blocks from available rooms
  const availableBlocks = useMemo(() => {
    const blocks = new Set<string>();
    availableRooms.forEach((room: Room) => {
      if (room.block) blocks.add(room.block);
    });
    return Array.from(blocks).sort();
  }, [availableRooms]);

  // Filter rooms based on selected filters
  const filteredRooms = useMemo(() => {
    return availableRooms.filter((room: Room) => {
      // Room Type filter
      if (filters.type !== "all" && room.type !== filters.type) {
        return false;
      }

      // Gender filter
      if (filters.gender !== "all" && room.gender.toLowerCase() !== filters.gender.toLowerCase()) {
        return false;
      }

      // Price Range filter
      if (filters.priceRange !== "all") {
        const price = room.price;
        switch (filters.priceRange) {
          case "0-1000":
            if (price > 1000) return false;
            break;
          case "1001-2000":
            if (price < 1001 || price > 2000) return false;
            break;
          case "2001-3000":
            if (price < 2001 || price > 3000) return false;
            break;
          case "3000+":
            if (price < 3001) return false;
            break;
        }
      }

      // Block filter
      if (filters.block !== "all" && room.block !== filters.block) {
        return false;
      }

      // Min Occupancy filter (available beds)
      const availableBeds = room.maxCap - room.currentResidentCount;
      if (filters.minOccupancy !== "all") {
        switch (filters.minOccupancy) {
          case "1+":
            if (availableBeds < 1) return false;
            break;
          case "2+":
            if (availableBeds < 2) return false;
            break;
          case "3+":
            if (availableBeds < 3) return false;
            break;
        }
      }

      return true;
    });
  }, [availableRooms, filters]);

  const handleBookRoom = (room: Room) => {
    setRoom(room);
    setTimeout(() => {
      navigate("/dashboard/payment");
    }, 50);
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      gender: "all",
      priceRange: "all",
      block: "all",
      minOccupancy: "all",
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "all");

  if (isLoading) return <RoomAssignmentLoader />;
  if (isError) return <CustomeRefetch refetch={refetchRooms} />;

  return (
    <div className="p-4 bg-card rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Room Assignment</h2>
        <p className="max-w-2xl font-thin text-muted-foreground">
          Select a room for the resident. The selected room will be reserved until payment is
          completed.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground mr-2">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </div>

        {/* Room Type */}
        <Select value={filters.type} onValueChange={(v) => updateFilter("type", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Room Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="double">Double</SelectItem>
            <SelectItem value="suite">Suite</SelectItem>
            <SelectItem value="quad">Quad</SelectItem>
          </SelectContent>
        </Select>

        {/* Gender */}
        <Select value={filters.gender} onValueChange={(v) => updateFilter("gender", v)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range */}
        <Select value={filters.priceRange} onValueChange={(v) => updateFilter("priceRange", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-1000">GH¢ 0 - 1,000</SelectItem>
            <SelectItem value="1001-2000">GH¢ 1,001 - 2,000</SelectItem>
            <SelectItem value="2001-3000">GH¢ 2,001 - 3,000</SelectItem>
            <SelectItem value="3000+">GH¢ 3,000+</SelectItem>
          </SelectContent>
        </Select>

        {/* Block */}
        <Select value={filters.block} onValueChange={(v) => updateFilter("block", v)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Block" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Blocks</SelectItem>
            {availableBlocks.map((block) => (
              <SelectItem key={block} value={block}>
                Block {block}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Available Beds */}
        <Select value={filters.minOccupancy} onValueChange={(v) => updateFilter("minOccupancy", v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Available" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Availability</SelectItem>
            <SelectItem value="1+">1+ bed free</SelectItem>
            <SelectItem value="2+">2+ beds free</SelectItem>
            <SelectItem value="3+">3+ beds free</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="ml-auto">
            <X className="w-3.5 h-3.5 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{filteredRooms.length}</span> of{" "}
        <span className="font-medium text-foreground">{availableRooms.length}</span> available rooms
        {hasActiveFilters && " (filtered)"}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-full mb-4">
            <House className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No rooms found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            No rooms match your current filter criteria. Try adjusting your filters to see more
            results.
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        /* Room Grid */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
          {filteredRooms.map((room: Room) => (
            <RoomCard key={room.id} room={room} onBookRoom={handleBookRoom} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomAssignment;
