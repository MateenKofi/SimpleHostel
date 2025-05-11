
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@components/ui/button"

interface Testimonial {
  id: number
  name: string
  location: string
  image: string
  rating: number
  text: string
}

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "London, UK",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Fuse made my backpacking trip through Europe so much easier! I found amazing hostels in every city, met incredible people, and saved a ton of money. The reviews were spot-on and the booking process was seamless.",
    },
    {
      id: 2,
      name: "Miguel Rodriguez",
      location: "Barcelona, Spain",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "As a solo traveler, finding the right hostel is crucial. Fuse helped me discover social hostels with great vibes. The filter options let me find exactly what I was looking for - places with good common areas and organized activities.",
    },
    {
      id: 3,
      name: "Aisha Patel",
      location: "Sydney, Australia",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      rating: 4,
      text: "I've been using Fuse for years across multiple continents. The platform is reliable, the photos are accurate, and the community reviews help me avoid bad experiences. It's my go-to app for budget travel accommodation.",
    },
    {
      id: 4,
      name: "Liam Chen",
      location: "Toronto, Canada",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The best feature of Fuse is how easy it makes comparing different options. I can quickly see which hostels have the amenities I need, check their locations on the map, and read honest reviews from other travelers.",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <section ref={ref} className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-800">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Travelers Say</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Discover why thousands of travelers choose Fuse for their adventures
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto px-4">
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full bg-white dark:bg-zinc-700 shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-600"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full bg-white dark:bg-zinc-700 shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-600"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="relative overflow-hidden h-[400px] md:h-[300px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={testimonials[currentIndex].id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute w-full h-full"
              >
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 md:p-10 h-full">
                  <div className="flex flex-col md:flex-row gap-6 h-full">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                          <img
                            src={testimonials[currentIndex].image || "/placeholder.svg"}
                            alt={testimonials[currentIndex].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1"
                        >
                          <Quote className="h-4 w-4 text-white" />
                        </motion.div>
                      </div>
                      <h3 className="font-semibold text-lg">{testimonials[currentIndex].name}</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">{testimonials[currentIndex].location}</p>
                      <div className="flex mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonials[currentIndex].rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-zinc-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <motion.blockquote
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-zinc-700 dark:text-zinc-300 italic relative"
                      >
                        <div className="absolute -top-6 -left-6 opacity-10">
                          <Quote className="h-12 w-12 text-red-500" />
                        </div>
                        <p className="relative z-10">{testimonials[currentIndex].text}</p>
                      </motion.blockquote>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? "bg-red-500" : "bg-zinc-300 dark:bg-zinc-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
