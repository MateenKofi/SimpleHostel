
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
      name: "Abena Owusu",
      location: "Accra, Ghana",
      image: "/Beautiful Young Woman applying facial cream fresh Healthy Skin Beauty Cosmetics and Facial treatment _ Premium AI-generated image.jpeg",
      rating: 5,
      text: "I used Fuse to plan my trip to Ghana. The app helped me find affordable and safe accommodation in Accra, and I was able to book a hostel that was perfect for my needs. The community reviews were spot-on and the booking process was seamless.",
    },
    {
      id: 2,
      name: "Kofi Mensah",
      image: "/Download free image of Happy young man headphones headset adult_  by ae about face, light, person, neon, and men 13067768.jpeg",
      location: "Kumasi, Ghana",
      rating: 5,
      text: "As a solo traveler in Ghana, finding the right hostel is crucial. Fuse helped me discover social hostels with great vibes. The filter options let me find exactly what I was looking for - places with good common areas and organized activities.",
    },
    {
      id: 3,
      name: "Ama Frimpong",
      location: "Cape Coast, Ghana",
      image: "download (1).jpeg",
      rating: 4,
      text: "I've been using Fuse for years across multiple continents. The platform is reliable, the photos are accurate, and the community reviews help me avoid bad experiences. It's my go-to app for budget travel accommodation in Ghana.",
    },
    {
      id: 4,
      name: "Nana Yaw",
      location: "Takoradi, Ghana",
      image: "/Ancestral Guidance for Immigration and 🌍 Navigate Immigration Success ✨ _ Spiritual Support.jpeg",
      rating: 5,
      text: "The best feature of Fuse is how easy it makes comparing different options. I can quickly see which hostels have the amenities I need, check their locations on the map, and read honest reviews from other travelers in Ghana.",
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
          className="max-w-3xl mx-auto mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Our Travelers Say</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Discover why thousands of travelers choose Fuse for their adventures
          </p>
        </motion.div>

        <div className="relative max-w-4xl px-4 mx-auto">
          <div className="absolute z-10 -translate-y-1/2 top-1/2 -left-4 md:-left-12">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="bg-white rounded-full shadow-md dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>

          <div className="absolute z-10 -translate-y-1/2 top-1/2 -right-4 md:-right-12">
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="bg-white rounded-full shadow-md dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600"
            >
              <ChevronRight className="w-6 h-6" />
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
                <div className="h-full p-6 bg-white shadow-lg dark:bg-zinc-900 rounded-xl md:p-10">
                  <div className="flex flex-col h-full gap-6 md:flex-row">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="relative">
                        <div className="w-20 h-20 mb-4 overflow-hidden rounded-full">
                          <img
                            src={testimonials[currentIndex].image || "/placeholder.svg"}
                            alt={testimonials[currentIndex].name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          className="absolute p-1 bg-red-500 rounded-full -bottom-2 -right-2"
                        >
                          <Quote className="w-4 h-4 text-white" />
                        </motion.div>
                      </div>
                      <h3 className="text-lg font-semibold">{testimonials[currentIndex].name}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{testimonials[currentIndex].location}</p>
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
                    <div className="flex items-center flex-1">
                      <motion.blockquote
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative italic text-zinc-700 dark:text-zinc-300"
                      >
                        <div className="absolute -top-6 -left-6 opacity-10">
                          <Quote className="w-12 h-12 text-red-500" />
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
