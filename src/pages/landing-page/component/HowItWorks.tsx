
import React from "react"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Search, MapPin, Calendar, CreditCard } from "lucide-react"

interface StepProps {
  icon: React.ReactNode
  title: string
  description: string
  step: number
  delay: number
}

function Step({ icon, title, description, step, delay }: StepProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6"
    >
      <div className="flex-shrink-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.2 }}
          className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-lg"
        >
          {step}
        </motion.div>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <div className="mr-3 text-red-500">{icon}</div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
    </motion.div>
  )
}

export function HowItWorksSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const steps = [
    {
      icon: <Search className="h-5 w-5" />,
      title: "Search for Hostels",
      description:
        "Enter your destination, travel dates, and preferences to find the perfect hostel for your adventure.",
      step: 1,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Compare Options",
      description:
        "Browse through our curated selection of hostels, read reviews, check amenities, and find the best location.",
      step: 2,
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Book Your Stay",
      description: "Select your room type and dates, then secure your reservation with our simple booking process.",
      step: 3,
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Enjoy Your Trip",
      description: "Receive instant confirmation, pack your bags, and get ready for an amazing hostel experience!",
      step: 4,
    },
  ]

  return (
    <section ref={ref} className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-800">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How HostelFinder Works</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Finding and booking your perfect hostel is quick and easy with our simple process
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line connecting steps */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-red-200 dark:bg-red-900/50 hidden md:block"></div>

            <div className="space-y-12">
              {steps.map((step, index) => (
                <Step
                  key={index}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  step={step.step}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
