
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function PartnersSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // In a real application, these would be actual partner logos
  const partners = [
    { id: 1, name: "TravelPass" },
    { id: 2, name: "Backpacker's Guild" },
    { id: 3, name: "WorldHostels" },
    { id: 4, name: "AdventureStay" },
    { id: 5, name: "BudgetTravel" },
    { id: 6, name: "GlobalLodging" },
  ]

  return (
    <section
      ref={ref}
      className="py-12 md:py-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-semibold mb-2">Trusted By Industry Leaders</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            We partner with the best in the travel industry to bring you quality experiences
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="h-12 w-32 bg-zinc-100 dark:bg-zinc-800 rounded-md flex items-center justify-center">
                <span className="font-semibold text-zinc-500 dark:text-zinc-400">{partner.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
