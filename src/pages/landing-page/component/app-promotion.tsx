// import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function AppPromotion() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="container py-16 md:py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div
          className="space-y-6"
          initial={{ x: -100, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Mobile App : Cooming Soon</h2>
            <p className="text-lg text-muted-foreground">
              Take Fuse with you everywhere. Book hostels on the go, manage your reservations, and connect with
              fellow travelers - all from your pocket. Our mobile app makes your travel experience seamless and
              worry-free, so you can focus on what matters most - creating unforgettable memories.
            </p>
          </div>
          {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="mt-4 bg-red-500 hover:bg-red-600">
              Get the App
            </Button>
          </motion.div> */}
        </motion.div>
        <motion.div
          className="relative"
          initial={{ x: 100, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="overflow-hidden aspect-square rounded-3xl bg-muted"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              ease: "easeInOut",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80"
              alt="Mobile app preview"
              className="object-cover w-full h-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
