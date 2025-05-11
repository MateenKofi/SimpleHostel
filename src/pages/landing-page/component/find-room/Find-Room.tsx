import { useState, useMemo } from "react";
import {
  Building,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowLeft,
} from "lucide-react";
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
import FindHostelSkeleton from '@components/loaders/HostelCardSkeleton'

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

  const { data: hostelData, isLoading, isError } = useQuery({
    queryKey: ["hostel", hostelId],
    queryFn: async () => {
      const response = await axios.get(`/api/hostels/get/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
    const rooms = hostelData?.Rooms || [];
    return rooms.filter((room: Room) => room.status === "AVAILABLE");
  }, [hostelData?.Rooms]);

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
    return <FindHostelSkeleton/>;
  }

  if (isError) {
    return <div className="text-center mt-8 text-red-500">Error fetching hostel data.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        className="my-2 bg-primary text-white px-4 py-2 rounded-md flex items-center"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        Back
      </button>

      {/* Hostel Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 rounded-lg overflow-hidden">
            {hostelData?.HostelImages?.length > 0 ? (
              <img
                src={hostelData.HostelImages[0].imageUrl || "/placeholder.svg"}
                alt={hostelData.name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <Building size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          <div className="w-full md:w-2/3 shadow-md p-4 border rounded-md">
            <h1 className="text-3xl font-bold mb-2">{hostelData?.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>
                  {hostelData?.address}, {hostelData?.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Manager: {hostelData?.manager}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span>{hostelData?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span>{hostelData?.email}</span>
              </div>
              {hostelData?.CalendarYear?.[0]?.isActive && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <Calendar size={18} />
                  <span>Academic Year: {hostelData.CalendarYear[0].name}</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-4">{hostelData?.description}</p>
          </div>
        </div>
      </div>

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
            <div className="text-center text-gray-500 mt-4">
              No rooms match your filters.
            </div>
          ) : (
            filteredRooms.map((room: Room) => (
              <Card
                key={room.id}
                className="w-full min-w-[300px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="pb-2 border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold">
                        Room {room.number}
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        Block {room.block} · Floor {room.floor}
                      </p>
                    </div>
                    <Badge
                      className={`${getStatusColor(
                        room.status
                      )} px-2 py-1 text-xs font-medium rounded-md`}
                    >
                      {room.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 mb-1">Type</p>
                        <p className="font-semibold">
                          {room.type.charAt(0) + room.type.slice(1).toLowerCase()}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 mb-1">Gender</p>
                        <p className="font-semibold">
                          {room.gender.charAt(0) + room.gender.slice(1).toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                      <Users size={18} className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Capacity</p>
                        <p className="font-semibold">
                          {room.currentResidentCount}/{room.maxCap} residents
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between items-center p-0 m-0">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="font-semibold">GHS {room.price}</p>
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
