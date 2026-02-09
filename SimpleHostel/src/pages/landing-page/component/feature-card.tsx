import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Users, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  delay: number
}

export function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const getIcon = () => {
    switch (icon) {
      case "Search":
        return <Search className="w-12 h-12 mb-4 text-red-500" />
      case "MapPin":
        return <MapPin className="w-12 h-12 mb-4 text-red-500" />
      case "Users":
        return <Users className="w-12 h-12 mb-4 text-red-500" />
      case "Star":
        return <Star className="w-12 h-12 mb-4 text-red-500" />
      default:
        return <Search className="w-12 h-12 mb-4 text-red-500" />
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
          >
            {getIcon()}
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
