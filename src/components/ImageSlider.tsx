"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ImageSliderLoader } from "@components/loaders/ImageSliderLoader"

type ImageSliderProps = {
  images: string[]
  fallbackImage?: string
  autoSlide?: boolean
  slideInterval?: number
  maxHeight?: string
  className?: string
}

const ImageSlider = ({
  images,
  fallbackImage = "/logo.png",
  autoSlide = false,
  slideInterval = 5000,
  maxHeight = "200px",
  className = "",
}: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Remove the console.log that was logging each image

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return

      if (e.key === "ArrowLeft") {
        prevSlide()
      } else if (e.key === "ArrowRight") {
        nextSlide()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [images.length, prevSlide, nextSlide])

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || images.length <= 1) return

    const interval = setInterval(nextSlide, slideInterval)
    return () => clearInterval(interval)
  }, [autoSlide, slideInterval, nextSlide, images.length])

  useEffect(() => {
    setIsLoading(true)
  }, [currentIndex])

  // 🟡 Case: No images – show fallback
  if (images.length < 1) {
    return (
      <div className={`relative w-full max-w-2xl mx-auto overflow-hidden shadow-lg ${className}`}>
        <div className="relative w-full" style={{ height: maxHeight }}>
          {isLoading && <ImageSliderLoader height={maxHeight} className="absolute inset-0" />}
          <img
            src={fallbackImage || "/placeholder.svg"}
            alt="Fallback image"
            className={`w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
        <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/60 px-3 py-1 rounded-md text-sm">
          No images to show.
        </p>
      </div>
    )
  }

  // 🟡 Case: One image – no nav or dots
  if (images.length === 1) {
    return (
      <div className={`relative w-full max-w-2xl overflow-hidden shadow-lg ${className}`}>
        <div className="relative w-full" style={{ height: maxHeight }}>
          {isLoading && <ImageSliderLoader height={maxHeight} className="absolute inset-0" />}
          <img
            src={images[0] || fallbackImage}
            alt="Single image"
            className={`w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      </div>
    )
  }

  // 🟢 Case: Multiple images – show slider
  return (
    <div
      className={`relative w-full max-w-2xl mx-auto overflow-hidden shadow-lg ${className}`}
      role="region"
      aria-label="Image carousel"
    >
      <div className="relative w-full" style={{ height: maxHeight }}>
        {isLoading && <ImageSliderLoader height={maxHeight} className="absolute inset-0" />}
        <img
          src={images[currentIndex] || fallbackImage}
          alt={`Slide ${currentIndex + 1} of ${images.length}`}
          className={`w-full h-full object-cover transition-all duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Next slide"
      >
        <ChevronRight />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
              currentIndex === i ? "bg-white" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={currentIndex === i ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageSlider
