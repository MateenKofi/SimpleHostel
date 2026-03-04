import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export function HeroCarousel() {
  const navigate = useNavigate()

  return (
    <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] overflow-hidden">
      {/* Static Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1920&q=80)"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white space-y-4 sm:space-y-6 px-4 max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          >
            Book Affordable Hostels in Ghana
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl max-w-[600px] mx-auto text-white/90"
          >
            Safe, verified hostels in prime locations. Book your stay in seconds.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 px-8 py-6 text-lg"
              onClick={() => navigate("/find-hostel")}
            >
              Find a Hostel Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white hover:text-primary-foreground border-white/30 backdrop-blur-sm transition-all duration-300 px-8 py-6 text-lg"
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
