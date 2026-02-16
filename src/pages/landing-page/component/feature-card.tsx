import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  MapPin,
  Clock,
  BadgeCent,
  Star,
  Headphones,
  type LucideIcon,
} from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  delay: number
}

const iconMap: Record<string, LucideIcon> = {
  Search,
  MapPin,
  Clock,
  BadgeCent,
  Star,
  Headphones,
}

export function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const IconComponent = iconMap[icon] || Search

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center gap-4 sm:gap-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
            className="bg-primary/15 p-3 sm:p-4 rounded-2xl"
          >
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary" strokeWidth={2} />
          </motion.div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-muted-foreground text-sm leading-snug">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
