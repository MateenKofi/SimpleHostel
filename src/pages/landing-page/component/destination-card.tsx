import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronRight, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Link } from "react-router-dom"

interface DestinationCardProps {
  image: string
  title: string
  description: string
  index: number
  id?: string | number
  loading?: boolean
}

export function DestinationCard({ image, title, description, index, id }: DestinationCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ y: 40, opacity: 0, scale: 0.95 }}
      animate={inView ? { y: 0, opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-border/50 group min-h-[240px]">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Image Section with Overlay */}
          <div className="relative w-full sm:w-2/5 overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

            <motion.img
              src={image || "/logo.png"}
              alt={title}
              className="object-cover w-full h-full min-h-[240px]"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            {/* Verified Badge */}
            <div className="absolute top-3 left-3 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Verified
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
            {/* Header & Description */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </h3>

              {/* Stats/Info Row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  Prime Location
                </span>
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  Available Rooms
                </span>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
                {description}
              </p>
            </div>

            {/* CTA Button */}
            <Link to={`/find/${id}/room`} className="mt-4">
              <Button
                className="w-full sm:w-auto group/btn"
                variant="default"
              >
                <span>Book Your Stay</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
