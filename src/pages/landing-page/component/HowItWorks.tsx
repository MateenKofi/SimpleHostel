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
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-50"
        >
          {step}
        </motion.div>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <div className="mr-3 text-primary">{icon}</div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
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
      description: "Enter your destination and dates to find available hostels.",
      step: 1,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Compare Options",
      description: "Browse hostels, read reviews, and check amenities.",
      step: 2,
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Book Your Stay",
      description: "Select your room and secure your reservation.",
      step: 3,
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Enjoy Your Trip",
      description: "Get instant confirmation and start your adventure.",
      step: 4,
    },
  ]

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Fuse Works</h2>
          <p className="text-lg text-muted-foreground">
            Book your hostel in 4 simple steps
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line connecting steps */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-primary/20 hidden md:block -z-10"></div>

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
