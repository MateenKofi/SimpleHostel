import React, { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ChevronDown, ChevronUp, Lightbulb, Shield, Camera, Thermometer, Clock } from "lucide-react"

interface AccordionItemProps {
  step: number
  title: string
  description: string
  isOpen: boolean
  onToggle: () => void
}

function AccordionItem({ step, title, description, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-foreground">
          Step {step}: {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-4 px-1"
        >
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </motion.div>
      )}
    </div>
  )
}

export function HowItWorksSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [openIndex, setOpenIndex] = useState(0)

  const steps = [
    {
      title: "Search for Your Perfect Hostel",
      description: "Choose the location and features you need from available hostels. Browse through verified properties with detailed information about amenities and nearby attractions.",
    },
    {
      title: "Compare Options & Reviews",
      description: "Review ratings, read verified guest reviews, and compare prices to find the best match for your needs and budget.",
    },
    {
      title: "Book Your Stay",
      description: "Select your preferred room type, choose your dates, and complete your booking with our secure payment system. Get instant confirmation.",
    },
    {
      title: "Enjoy Your Experience",
      description: "Arrive at your hostel with confidence. Access 24/7 support and enjoy a comfortable, verified accommodation experience.",
    },
  ]

  return (
    <section ref={ref} className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            From setup to everyday use, we've made booking effortless.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left: Feature Showcase Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-2xl p-8 lg:p-12 flex items-center justify-center"
          >
            <div className="w-full max-w-sm">
              {/* Brand/Logo Area */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-500">Fuse</span>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Search</span>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Security</span>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Reviews</span>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Thermometer className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Comfort</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Accordion Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              {steps.map((step, index) => (
                <AccordionItem
                  key={index}
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                />
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4 flex-wrap">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2">
                Start now
              </button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>5 mins to complete steps</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
