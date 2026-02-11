
import  React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Send, CheckCircle } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail("")
    }, 1500)
  }

  return (
    <section ref={ref} className="py-16 md:py-24 bg-white dark:bg-zinc-900">
      <div className="container">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-3 p-8 md:p-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Get Exclusive Travel Deals & Tips</h2>
              <p className="text-white/90 mb-6">
                Subscribe to our newsletter and be the first to know about special promotions, travel tips, and new
                hostel openings around the world.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/20 backdrop-blur-sm p-6 rounded-lg flex items-center"
                >
                  <CheckCircle className="h-8 w-8 text-white mr-4" />
                  <div>
                    <h3 className="font-semibold text-white text-lg">Thank You for Subscribing!</h3>
                    <p className="text-white/90">You'll start receiving our travel updates and exclusive deals soon.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="flex">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-r-none bg-white/20 text-white placeholder:text-white/70 border-white/30 focus-visible:ring-white"
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-l-none bg-white hover:bg-white/90 text-red-600"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                          >
                            <Send className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <>Subscribe</>
                        )}
                      </Button>
                    </div>
                    {error && <p className="mt-2 text-white text-sm">{error}</p>}
                  </div>
                  <p className="text-sm text-white/70">We respect your privacy. Unsubscribe at any time.</p>
                </form>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block md:col-span-2 relative"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=500&q=80')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-red-600/50"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
