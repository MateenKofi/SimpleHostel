
import  React from "react"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Users, Building, Globe, Award } from "lucide-react"

interface StatProps {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
  delay: number
}

function StatItem({ icon, value, suffix, label, delay }: StatProps) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  const countingStarted = useRef(false)

  useEffect(() => {
    if (inView && !countingStarted.current) {
      countingStarted.current = true
      let start = 0
      const end = value
      const duration = 2000
      const increment = end / (duration / 16) // 16ms is roughly 60fps

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md text-center"
    >
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">{icon}</div>
      </div>
      <h3 className="text-3xl md:text-4xl font-bold mb-2 flex justify-center items-end">
        <motion.span
          initial={{ scale: 1 }}
          animate={inView ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
        >
          {count}
        </motion.span>
        <span className="text-red-500 ml-1">{suffix}</span>
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400">{label}</p>
    </motion.div>
  )
}

export function StatisticsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-16 md:py-24 bg-white dark:bg-zinc-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fuse by the Numbers</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Join our global community of travelers and hostel owners
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem
            icon={<Users className="h-6 w-6 text-red-500" />}
            value={500000}
            suffix="+"
            label="Happy Travelers"
            delay={0.1}
          />
          <StatItem
            icon={<Building className="h-6 w-6 text-red-500" />}
            value={10000}
            suffix="+"
            label="Hostels Listed"
            delay={0.2}
          />
          <StatItem
            icon={<Globe className="h-6 w-6 text-red-500" />}
            value={120}
            suffix=""
            label="Countries Covered"
            delay={0.3}
          />
          <StatItem
            icon={<Award className="h-6 w-6 text-red-500" />}
            value={98}
            suffix="%"
            label="Satisfaction Rate"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  )
}
