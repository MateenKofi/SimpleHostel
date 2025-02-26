import { useState } from "react";
import { Bed, House } from "lucide-react";

const RoomAssignment = () => {
  interface Room {
    id: number;
    roomNumber: string;
    basePrice: number;
    maxOccupancy: number;
    amenities: string[];
    isAvailable: boolean;
  }

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const rooms: Room[] = [
    {
      id: 1,
      roomNumber: "101",
      basePrice: 500,
      maxOccupancy: 2,
      amenities: ["WiFi", "Air Conditioning", "TV"],
      isAvailable: true,
    },
    {
      id: 2,
      roomNumber: "102",
      basePrice: 450,
      maxOccupancy: 3,
      amenities: ["WiFi", "TV"],
      isAvailable: false,
    },
    {
      id: 3,
      roomNumber: "103",
      basePrice: 600,
      maxOccupancy: 4,
      amenities: ["WiFi", "Air Conditioning", "TV", "Mini Bar"],
      isAvailable: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4">Room Assignment</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`border rounded-lg p-4 transition-all cursor-pointer ${
              selectedRoom?.id === room.id
                ? "border-primary border-2"
                : "hover:border-primary"
            } ${!room.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => room.isAvailable && setSelectedRoom(room)}
          >
            <div className="flex justify-between items-center mb-3">
              <h5 className="text-lg font-medium flex items-center gap-2">
                <House className="w-4 h-4" />
                <span>{room.roomNumber}</span>
              </h5>
              <span className="text-primary font-semibold">
                GH₵{room.basePrice.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Bed className="w-4 h-4" />
                <span>{room.maxOccupancy} Beds</span>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Status indicator */}
              <div className="mt-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    room.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {room.isAvailable ? "Available" : "Occupied"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Room Display */}
      {selectedRoom && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Selected Room</h3>
          <p className="text-sm">Room Number: {selectedRoom.roomNumber}</p>
          <p className="text-sm">Price: GH₵{selectedRoom.basePrice}</p>
          <p className="text-sm">Max Occupancy: {selectedRoom.maxOccupancy}</p>
        </div>
      )}
    </div>
  );
};

export default RoomAssignment;
