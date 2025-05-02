import { useState } from "react";
import {
  Bed,
  ChevronLeft,
  ChevronRight,
  HomeIcon as House,
  Loader,
  ShieldPlus,
  User,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import RoomAssignmentLoader from "../../loaders/RoomAssignmentLoader";
import { axiosConfig } from "../../../helper/axiosConfig";
import { Room, Amenity } from "../../../helper/types/types";
import CustomeRefetch from "@/components/CustomeRefetch";

const RoomAssignment = () => {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState<Record<string, number>>({});
  const fallbackImage = "/logo.png";

  const hostelId = localStorage.getItem("hostelId") || "";
  const residentId = localStorage.getItem("residentId") || "";

  // Function to handle image navigation
  const navigateImage = (
    roomId: string,
    direction: "prev" | "next",
    totalImages: number
  ) => {
    setActiveImage((prev) => {
      const currentIndex = prev[roomId] || 0;
      return {
        ...prev,
        [roomId]:
          direction === "prev"
            ? (currentIndex - 1 + totalImages) % totalImages
            : (currentIndex + 1) % totalImages,
      };
    });
  };

  // Mutation to initialize payment
  const initializePaymentMutation = useMutation({
    mutationFn: async (data: {
      roomId: string;
      residentId: string;
      initialPayment: number;
    }) => {
      try {
        const response = await axios.post(
        `/api/payments/init`,
        data,
        axiosConfig
      );
        if (response && response.data && response.data.paymentUrl) {
        navigate("/dashboard/resident-management");
        localStorage.removeItem("residentId");
        toast(response.data.message || "Redirecting to payment...");
        window.location.href = response.data.paymentUrl.authorizationUrl;
      }
      return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Failed to initialize payment.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      }
    },
  });

  // Fetch rooms data
  const { data, isLoading, isError, refetch:refetchRooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await axios.get(`/api/rooms/hostel/${hostelId}`, axiosConfig);
      return response.data.data;
    },
    enabled:!!hostelId
  });

  // Transform the API data to match the Room interface and filter available rooms
  const rooms: Room[] = data?.rooms
    ? data.rooms
        .map((room: Room) => ({
          id: room.id,
          roomNumber: room.roomNumber,
          basePrice: room.price,
          maxOccupancy: room.maxCap,
          currentResidentCount: room.currentResidentCount,
          gender: room.gender,
          amenities: room.Amenities?.map((amenity: Amenity) => amenity.name) || [],
          isAvailable: room.status === "AVAILABLE",
          images: room.RoomImage?.map((img) => img.imageUrl) || [],
        }))
        .filter((room:Room) => room.isAvailable)
    : [];

  if (isLoading) return <RoomAssignmentLoader />;
  if (isError) return <CustomeRefetch refetch={refetchRooms}/>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Room Assignment</h2>
        <p className="text-gray-600 font-thin max-w-2xl">
          Select a room for the resident. The selected room will be reserved until payment is completed.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-lg overflow-hidden cursor-pointer transition-all"
          >
            {/* Image Carousel */}
            <div className="relative h-48 w-full">
              {(room.images ?? []).length > 0 ? (
                <>
                  <img
                    src={((room.images as string[] | undefined) ?? [fallbackImage])[activeImage[room.id] || 0]}
                    alt={`Room ${room.roomNumber}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                  {(room.images ?? []).length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage(room.id, "prev", (room.images ?? []).length);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 hover:bg-black/50"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage(room.id, "next", (room.images ?? []).length);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 hover:bg-black/50"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {(room.images ?? []).map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImage((prev) => ({
                                ...prev,
                                [room.id]: index,
                              }));
                            }}
                            className={`h-1.5 rounded-full ${
                              (activeImage[room.id] || 0) === index
                                ? "w-4 bg-white"
                                : "w-1.5 bg-white/60"
                            } transition-all`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img
                  src={fallbackImage}
                  alt="Fallback"
                  className="object-cover w-full h-full"
                />
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h5 className="text-lg font-medium flex items-center gap-2">
                  <House className="w-4 h-4" />
                  <span>{room.roomNumber}</span>
                </h5>
                <span className="flex gap-2 items-center bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  <ShieldPlus />
                  <span>
                    {room.currentResidentCount} / {room.maxOccupancy} Occupants
                  </span>
                </span>
                <span className="text-primary font-semibold">
                  GH{room?.basePrice?.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2 text-gray-600 text-sm">
                  <span className="flex items-center gap-1 bg-gray-100 text-gray-900 px-2 py-1 rounded-full shadow">
                    <Bed className="w-4 h-4" />
                    <div className="h-4/5 w-[0.2px] bg-gray-500 "></div>
                    <span>{room.maxOccupancy} Bed(s)</span>
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 text-gray-900 px-2 py-1 rounded-full shadow capitalize">
                    <User className="w-4 h-4" />
                    <div className="h-4/5 w-[0.2px] bg-gray-500 "></div>
                    <span>{room.gender}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-900"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3">
                  <button
                    className="w-full flex justify-center items-center text-base font-medium text-center bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800 transition-all"
                    disabled={initializePaymentMutation.isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      initializePaymentMutation.mutate({
                        roomId: room.id,
                        residentId,
                        initialPayment: room?.basePrice,
                      });
                    }}
                  >
                    {initializePaymentMutation.isPending ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Book Room"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAssignment;