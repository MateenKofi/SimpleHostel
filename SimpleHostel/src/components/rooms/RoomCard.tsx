import { Room } from "@/helper/types/types";
import { Users, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

type RoomCardProps = {
  room: Room;
  onBookRoom: (room: Room) => void;
};

const RoomCard = ({ room, onBookRoom }: RoomCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = room?.roomImages?.map((i) => i.imageUrl) || [];

  // Auto-advance images
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex] || "/logo.png";

  // Status colors
  const getStatusColor = () => {
    switch (room.status) {
      case "available":
        return "bg-green-500";
      case "maintenance":
        return "bg-yellow-500";
      case "occupied":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Room type label
  const getRoomTypeLabel = () => {
    return room.type
      ? room.type.charAt(0).toUpperCase() + room.type.slice(1).toLowerCase()
      : "N/A";
  };

  // Gender label
  const getGenderLabel = () => {
    return room.gender
      ? room.gender.charAt(0).toUpperCase() + room.gender.slice(1).toLowerCase()
      : "N/A";
  };

  return (
    <div
      className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-muted"
      onClick={() => onBookRoom(room)}
    >
      {/* Background Image */}
      <img
        src={currentImage}
        alt={`Room ${room.roomNumber}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Image Navigation Buttons (only show if multiple images) */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Image Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-3 left-3">
        <span
          className={`${getStatusColor()} px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm`}
        >
          {room.status}
        </span>
      </div>

      {/* Gradient Overlay - starts lower to show more image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Content Overlay - positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* Room Number and Location */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-xl">Room {room.roomNumber}</h3>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                Block {room.block}
                {room.floor && ` · Floor ${room.floor}`}
              </span>
            </div>
          </div>
        </div>

        {/* Room Details - Type, Gender, Capacity */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <span className="text-xs">Type</span>
            <span className="text-xs font-semibold">{getRoomTypeLabel()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <span className="text-xs">Gender</span>
            <span className="text-xs font-semibold">{getGenderLabel()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">
              {room.currentResidentCount}/{room.maxCap}
            </span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-white/70">Price per semester</p>
            <p className="text-lg font-bold">
              GHS {room.price.toLocaleString()}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookRoom(room);
            }}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
