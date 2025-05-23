import { useState, useMemo } from "react";
import { Building, Users, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Room } from "@/helper/types/types";
import { useSelectedRoomStore } from "@/controllers/SelectedRoomStore";
import FilterPanel from "@/components/FilterPanel";
import { RoomFilterConfig } from "@/helper/room_filter_config";
import { parseRange } from "@/utils/parseRange";
import FindHostelSkeleton from "@components/loaders/HostelCardSkeleton";
import ImageSlider from "@/components/ImageSlider";
import CustomeRefetch from "@/components/CustomeRefetch";
import SEOHelmet from "@/components/SEOHelmet";

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
  const { setRoom } = useSelectedRoomStore();

  const {
    data: RoomData,
    isLoading,
    isError,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms", hostelId],
    queryFn: async () => {
      const response = await axios.get(`/api/rooms/get/hostel/${hostelId}`);
      return response.data?.data;
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
    return rooms.filter((room: Room) => room.status === "AVAILABLE");
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
        activeFilters.roomType.includes(room.roomType);

      return matchesGender && matchesPriceRange && matchesRoomType;
    });
  }, [availableRooms, activeFilters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleRoomClick = (room: Room) => {
    setRoom(room);
    setTimeout(() => navigate("/resident-form"), 50);
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
        title="Find Room - Fuse"
        description="Search for the best rooms on Fuse."
        keywords="find room, Fuse, student accommodation"
      />
      <button
        className="my-2 bg-primary text-white px-4 py-2 rounded-md flex items-center"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        Back
      </button>

      <div className="w-full flex flex-col md:flex-row gap-6">
        <div className="w-full lg:w-64">
          <FilterPanel
            FilterConfig={RoomFilterConfig}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
          />
        </div>

        {/* Rooms Grid */}
        <div className="w-full flex flex-wrap gap-6">
          {filteredRooms.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
              No rooms match your filters.
            </div>
          ) : (
            filteredRooms.map((room: Room) => (
              <Card
                key={room.id}
                className=" w-full md:max-w-[300px] overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-zinc-900"
              >
                <CardHeader className="p-2 border-b bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold text-black dark:text-white">
                        Room {room.number}
                      </CardTitle>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Block {room.block} · Floor {room.floor}
                      </p>
                    </div>
                    <Badge
                      className={`${getStatusColor(
                        room.status
                      )} px-2 py-1 text-xs font-medium rounded-md text-white`}
                    >
                      {room.status}
                    </Badge>
                  </div>
                </CardHeader>
                <div>
                  <ImageSlider
                    images={room?.RoomImage?.map((i) => i.imageUrl) ?? []}
                  />
                </div>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="bg-gray-50 dark:bg-zinc-800 p-2 rounded-md">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Type</p>
                      <p className="font-semibold text-xs text-black dark:text-white">
                        {room.type.charAt(0) + room.type.slice(1).toLowerCase()}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-800 p-2 rounded-md">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Gender</p>
                      <p className="font-semibold text-xs text-black dark:text-white">
                        {room.gender.charAt(0) +
                          room.gender.slice(1).toLowerCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-zinc-800 rounded-md">
                      <Users size={18} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Capacity</p>
                        <p className="font-semibold text-xs text-black dark:text-white">
                          {room.currentResidentCount}/{room.maxCap} residents
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-zinc-800 rounded-md">
                    <Building size={18} className="text-gray-600 dark:text-gray-400" />
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Amenities</p>
                      <p className="w-full font-semibold text-xs text-black dark:text-white">
                        {room?.Amenities?.length as number < 1 ? (
                          <span>No Amenities</span>
                        ) : (
                          <>
                            {room?.Amenities?.map((amenity) => (
                              <span
                                key={amenity.id}
                                className="mr-[2px] bg-green-300 dark:bg-green-700 px-1 rounded-md text-xs text-black dark:text-white"
                              >
                                {amenity.name}
                              </span>
                            ))}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-2 bg-gray-50 dark:bg-zinc-800">
                  <div className="w-full flex justify-between items-center p-0 m-0">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                      <p className="font-semibold text-black dark:text-white">GHS {room.price}</p>
                    </div>
                    <Button onClick={() => handleRoomClick(room)}>
                      Book Now
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FindRoom;