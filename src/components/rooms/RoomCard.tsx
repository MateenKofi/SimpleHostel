// components/room-card.tsx

import React from "react";
import { Room, Hostel } from "@/helper/types/types";

interface RoomCardProps {
  room: Room;
  hostel: Hostel;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, hostel }) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {hostel.name} - Room {room.name}
        </h3>
        <p className="text-sm text-gray-600">
          Type: <span className="font-medium">{room.type}</span>
        </p>
        <p className="text-sm text-gray-600">
          Gender: <span className="font-medium">{room.gender}</span>
        </p>
        <p className="text-sm text-gray-600">
          Status:{" "}
          <span
            className={`font-medium ${room.status === "available"
                ? "text-green-600"
                : "text-red-500"
              }`}
          >
            {room.status}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Price: <span className="font-semibold">GHS {room.price}</span>
        </p>
      </div>
      <div className="px-4 pb-4">
        <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RoomCard;