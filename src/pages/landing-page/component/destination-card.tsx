import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface DestinationCardProps {
  image: string
  title: string
  description: string
  index: number
}

export function DestinationCard({ image, title, description, index }: DestinationCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : { x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 overflow-hidden">
            <motion.img
              src={image}
              alt={title}
              className="h-48 sm:h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex-1 p-6">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4">{description}</p>
            <motion.a
              href="#"
              className="text-red-500 hover:text-red-600 inline-flex items-center"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              Learn more <ChevronRight className="ml-1 h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
