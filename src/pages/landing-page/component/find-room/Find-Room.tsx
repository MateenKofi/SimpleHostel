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
import FindHostelSkeleton from "@/components/loaders/HostelCardSkeleton";
import ImageSlider from "@/components/ImageSlider";
import CustomeRefetch from "@/components/CustomeRefetch";
import SEOHelmet from "@/components/SEOHelmet";
import { useUserStore } from "@/controllers/UserStore";
import { useAddedResidentStore } from "@/controllers/AddedResident";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSelectedCalendarYearStore } from "@/controllers/SelectedCalendarYear";

interface ActiveFilters {
  [key: string]: string[];
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FindRoom = () => {
  const navigate = useNavigate();
  const { id: hostelId } = useParams();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    gender: [],
    priceRange: [],
    roomType: [],
  });
  const { setRoom } = useSelectedRoomStore();
  const { user, token } = useUserStore();
  const setResident = useAddedResidentStore((state) => state.setResident);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingRoom, setSelectedBookingRoom] = useState<Room | null>(null);
  const [password, setPassword] = useState("");
  const calendarYear = useSelectedCalendarYearStore((state) => state.calendarYear);

  const BookingMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedBookingRoom) return;

      // OPTION B: Try to find existing resident profile first to skip registration
      try {
        const analyticsRes = await axios.get(`/api/analytics/get/resident-dashboard/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const existingResidentId = analyticsRes.data?.data?.residentId;

        if (existingResidentId) {
          // If resident profile exists, we don't need to register.
          // We can proceed to payment directly by setting the resident in store.
          // The init-payment endpoint will handle the room assignment.
          return {
            success: true,
            isExisting: true,
            data: {
              id: existingResidentId,
              name: user.name,
              email: user.email,
              phone: user.phoneNumber
            }
          };
        }
      } catch (err) {
        console.log("No existing resident profile found or error fetching analytics.");
      }

      // If no existing profile, we must register.
      // We use the older /api/residents/register with FormData which doesn't strictly require password
      // when the user is already authenticated and we identify them by email/userId.
      const formData = new FormData();
      const nameParts = user.name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || firstName;

      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phoneNumber || "0240000000");
      formData.append("gender", selectedBookingRoom.gender.toUpperCase());
      formData.append("studentId", "PENDING");
      formData.append("course", "PENDING");
      formData.append("emergencyContactName", "PENDING");
      formData.append("emergencyContactPhone", "0240000000");
      formData.append("relationship", "Self");
      formData.append("hostelId", selectedBookingRoom.hostelId || "");
      formData.append("calendarYearId", calendarYear?.id || "");
      formData.append("roomId", selectedBookingRoom.id || "");

      const response = await axios.post(`/api/residents/register`, formData);
      return response.data;
    },
    onSuccess: (res) => {
      const residentData = res?.isExisting ? res.data : res?.data;
      setResident(residentData);

      toast.success(res?.isExisting ? "Ready for payment!" : "Booking initiated successfully!");
      setIsBookingModalOpen(false);
      setTimeout(() => {
        navigate("/payment");
      }, 500);
    },
    onError: (error: any) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleRoomClick = (room: Room) => {
    if (!token || !user) {
      toast.error("Please log in to book a room");
      navigate("/login");
      return;
    }
    setRoom(room);
    setSelectedBookingRoom(room);
    setIsBookingModalOpen(true);
  };

  const confirmBooking = () => {
    BookingMutation.mutate();
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
                        Room {room.roomNumber}
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
                    images={room?.roomImages?.map((i) => i.imageUrl) ?? []}
                  />
                </div>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="bg-gray-50 dark:bg-zinc-800 p-2 rounded-md">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Type</p>
                      <p className="font-semibold text-xs text-black dark:text-white">
                        {room?.type?.charAt(0) + room?.type?.slice(1).toLowerCase()}
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
                        {(room?.amenities?.length || 0) < 1 ? (
                          <span>No Amenities</span>
                        ) : (
                          <>
                            {room?.amenities?.map((amenity) => (
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

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to book Room {selectedBookingRoom?.roomNumber}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-slate-50 p-4 rounded-md text-sm space-y-2 dark:bg-zinc-800">
              <p><span className="font-semibold">Room:</span> {selectedBookingRoom?.roomNumber}</p>
              <p><span className="font-semibold">Price:</span> GHS {selectedBookingRoom?.price}</p>
              <p><span className="font-semibold">Type:</span> {selectedBookingRoom?.type}</p>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              By confirming, you will be redirected to the payment page.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmBooking} disabled={BookingMutation.isPending}>
              {BookingMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : "Confirm & Pay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindRoom;