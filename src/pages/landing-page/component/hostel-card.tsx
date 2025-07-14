import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Link } from "react-router-dom"

interface HostelCardProps {
  image: string
  title: string
  location: string
  index: number
  id?: string
}

export function HostelCard({ image, title, location,  index,id }: HostelCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <Link to={`/find/${id}/room`}>
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className="transition-shadow duration-300 cursor-pointer group hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="absolute inset-0 object-cover w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <CardContent className="p-4">
          <motion.h3
            className="font-semibold transition-colors group-hover:text-red-500"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.h3>
          <p className="text-sm text-muted-foreground">{location}</p>
        </CardContent>
      </Card>
    </motion.div>
    </Link>
  )
}
