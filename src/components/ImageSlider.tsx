import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageSliderProps = {
  images: string[];
};

const ImageSlider = ({ images }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🟡 Case: No images – show fallback
  if (images.length < 1) {
    return (
      <div className="relative w-full max-w-xl mx-auto overflow-hidden rounded-2xl shadow-lg">
        <img
          src="/logo.png"
          alt="Fallback image"
          className="w-full max-h-[200px] object-cover"
        />
        <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/60 px-3 py-1 rounded-md text-sm">
          No images to show.
        </p>
      </div>
    );
  }

  // 🟡 Case: One image – no nav or dots
  if (images.length === 1) {
    return (
      <div className="relative w-full max-w-xl mx-auto overflow-hidden rounded-2xl shadow-lg">
        <img
          src={images[0] || "/logo.png"}
          alt="Single image"
          className="w-full max-h-[200px] object-cover"
        />
      </div>
    );
  }

  // 🟢 Case: Multiple images – show slider
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-xl mx-auto overflow-hidden rounded-2xl shadow-lg">
      <img
        src={images[currentIndex] || "/logo.png"}
        alt={`Image ${currentIndex}`}
        className="w-full max-h-[200px] object-cover transition-all duration-500"
      />

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black"
      >
        <ChevronRight />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
              currentIndex === i ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
