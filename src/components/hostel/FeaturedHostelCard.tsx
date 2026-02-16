import { Hostel } from "@/helper/types/types";
import { MapPin, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelectedCalendarYearStore } from "@/stores/useSelectedCalendarYearStore";

type FeaturedHostelCardProps = {
  hostel: Hostel;
  index?: number;
};

const FeaturedHostelCard = ({ hostel, index = 0 }: FeaturedHostelCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const setCalendarYear = useSelectedCalendarYearStore(
    (state) => state.setCalendarYear
  );
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
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex] || "/logo.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/find/${hostel.id}/room`}
        onClick={() => {
          if (hostel.calendarYears) {
            setCalendarYear(hostel.calendarYears[0] || null);
          } else {
            setCalendarYear(null);
          }
        }}
        className="block"
      >
        <div className="relative h-[400px] w-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-muted">
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

          {/* Featured Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold rounded-full">
              <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              Featured
            </span>
          </div>

          {/* Rating Badge (top right) */}
          {hostel.averageRating !== undefined && hostel.averageRating > 0 && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-semibold text-white">
                  {hostel.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Gradient Overlay - reduced area */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            {/* Hostel Name */}
            <h3 className="font-bold text-xl truncate mb-1">{hostel.name}</h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-white/80 mb-4">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm truncate">{hostel.location}</span>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-white/60">From</p>
                <p className="text-xl font-bold">
                  GHS {getMinPrice().toLocaleString()}
                </p>
              </div>
              <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap shadow-lg">
                View Rooms
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default FeaturedHostelCard;
