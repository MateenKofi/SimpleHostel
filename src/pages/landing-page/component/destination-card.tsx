import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Link } from "react-router-dom"

interface DestinationCardProps {
  image: string
  title: string
  description: string
  index: number
  id?: string
}

export function DestinationCard({ image, title, description, index, id }: DestinationCardProps) {
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
      <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl min-h-52">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full overflow-hidden sm:w-1/3">
            <motion.img
              src={image || "./logo.png"}
              alt={title}
              className="object-cover w-full max-h-[210px] "
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex-1 p-6">
            <h3 className="mb-2 text-xl font-semibold">{title}</h3>
            <p className="mb-4 text-muted-foreground">{description}</p>
            <motion.span
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <Link
                to={`/find/${id}/room`}
                className="inline-flex items-center tracking-tighter text-red-500 hover:text-red-600"
              >
                Book Your Stay <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
