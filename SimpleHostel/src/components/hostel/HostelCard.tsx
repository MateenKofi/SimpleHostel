import { Hostel } from "@/helper/types/types";
import { MapPin, Phone, MapPinHouse, Star } from "lucide-react";
import { useState, useEffect } from "react";

type HostelCardProps = {
  hostel: Hostel;
  onFindRoom: (hostel: Hostel) => void;
};

const HostelCard = ({ hostel, onFindRoom }: HostelCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = hostel?.hostelImages?.map((i) => i.imageUrl) || [];

  // Helper function to get minimum room price
  const getMinPrice = (): number => {
    if (!hostel.rooms || hostel.rooms.length === 0) return 0;
    return Math.min(...hostel.rooms.map((room) => room.price));
  };

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

  return (
    <div
      className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-muted"
      onClick={() => onFindRoom(hostel)}
    >
      {/* Background Image */}
      <img
        src={currentImage}
        alt={hostel.name}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={handleNextImage}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* Rating Badge */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg truncate pr-2">{hostel.name}</h3>
          {hostel.averageRating !== undefined && hostel.averageRating > 0 && (
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full shrink-0">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold">
                {hostel.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-white/90 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-sm truncate">{hostel.location}</span>
        </div>

        {/* Phone and Address - Quick Actions */}
        <div className="flex gap-2 mb-3">
          <a
            href={`tel:${hostel.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-2.5 py-1.5 rounded-lg transition-colors"
            title={`Call ${hostel.phone}`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="text-xs">Call</span>
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              hostel.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-2.5 py-1.5 rounded-lg transition-colors flex-1"
            title={hostel.address}
          >
            <MapPinHouse className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">View on Map</span>
          </a>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-white/70">Starting from</p>
            <p className="text-lg font-bold">
              GHS {getMinPrice().toLocaleString()}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFindRoom(hostel);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Find Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
