import { useState } from "react";
import { Bed, ChevronLeft, ChevronRight, HomeIcon as House } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Room {
  id: string; // Adjusted type to string if IDs are UUIDs
  roomNumber: string;
  basePrice: number;
  maxOccupancy: number;
  amenities: string[];
  isAvailable: boolean;
  images: string[];
}

const RoomAssignment = () => {
  const [activeImage, setActiveImage] = useState<Record<string, number>>({});
  const fallbackImage = "/logo.png"; // Add the path to your fallback image

  // Function to handle image navigation
  const navigateImage = (roomId: string, direction: "prev" | "next", totalImages: number) => {
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

  // Fetch rooms data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const hostelId = localStorage.getItem("hostelId");
      if (!hostelId) {
        throw new Error("Hostel ID is not available in local storage.");
      }
      const response = await axios.get(`/api/rooms/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response?.data.data;
    },
  });

  // Transform the API data to match the Room interface
  const rooms: Room[] = data?.rooms
    ? data.rooms
        .map((room: any) => ({
          id: room.id,
          roomNumber: room.number, // API uses "number" instead of "roomNumber"
          basePrice: room.price, // API field "price" corresponds to basePrice
          maxOccupancy: room.maxCap, // API field "maxCap" corresponds to maxOccupancy
          amenities: room.Amenities?.map((amenity: any) => amenity.name) || [],
          isAvailable: room.status === "AVAILABLE",
          images: room.RoomImage?.map((img: any) => img.imageUrl) || [],
        }))
        .filter((room: Room) => room.isAvailable) // Filter only available rooms
    : [];

  if (isLoading) return <div>Loading rooms...</div>;
  if (isError) return <div>Error loading rooms.</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Room Assignment</h2>
        <p className="text-gray-600 font-thin max-w-2xl">
          Select a room for the resident. The selected room will be reserved for the resident until the payment is
          completed.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-lg overflow-hidden hover:border-primary cursor-pointer transition-all"
          >
            {/* Image Carousel */}
            <div className="relative h-48 w-full">
              {room.images.length > 0 ? (
                <>
                  <img
                    src={room.images[activeImage[room.id] || 0]}
                    alt={`Room ${room.roomNumber}`}
                    className="object-cover w-full h-full"
                  />

                  {/* Navigation buttons */}
                  {room.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage(room.id, "prev", room.images.length);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 hover:bg-black/50"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage(room.id, "next", room.images.length);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 hover:bg-black/50"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>

                      {/* Image indicators */}
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {room.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImage((prev) => ({ ...prev, [room.id]: index }));
                            }}
                            className={`h-1.5 rounded-full ${
                              (activeImage[room.id] || 0) === index ? "w-4 bg-white" : "w-1.5 bg-white/60"
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
                <div>
                  <h5 className="text-lg font-medium flex items-center gap-2">
                    <House className="w-4 h-4" />
                    <span>{room.roomNumber}</span>
                  </h5>
                </div>
                <span className="text-primary font-semibold">
                  GH{room.basePrice.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2 text-gray-600 text-sm">
                  <Bed className="w-4 h-4" />
                  <span>{room.maxOccupancy} Beds</span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Status indicator */}
                <div className="flex justify-between items-center mt-3 gap-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      room.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {room.isAvailable ? "Available" : "Occupied"}
                  </span>
                  <Link
                    to="/dashboard/payment"
                    className="mt-4 text-base font-medium w-full text-center bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Book Room
                  </Link>
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
