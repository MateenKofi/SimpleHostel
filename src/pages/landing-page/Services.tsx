import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Building2, Calendar, Users, CreditCard, Shield, HeadphonesIcon, Zap, Globe } from "lucide-react"
import SEOHelmet from "@/components/SEOHelmet"

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative py-20 text-white bg-gradient-to-b from-zinc-900 to-zinc-800 md:py-28">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
          </div>
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl"
              >
                Our <span className="text-primary">Services</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg md:text-xl text-zinc-300"
              >
                Comprehensive hostel management solutions designed to make your life easier. From booking to billing, we've got you covered.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid Section */}
        <ServicesGridSection />

        {/* Why Choose Us Section */}
        <WhyChooseUsSection />

        {/* CTA Section */}
        <CTASection />
      </main>
    </div>
  )
}

function ServicesGridSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const services = [
    {
      icon: <Building2 className="w-10 h-10 text-primary" />,
      title: "Hostel Listings",
      description: "Browse and discover hostels from our extensive network. Find the perfect accommodation that matches your needs, budget, and location preferences.",
      features: ["Verified hostel properties", "Detailed photo galleries", "Amenity filters", "Location-based search"],
    },
    {
      icon: <Calendar className="w-10 h-10 text-primary" />,
      title: "Room Booking",
      description: "Seamlessly book rooms online with real-time availability. Choose from single, double, suite, or quad rooms based on your requirements.",
      features: ["Real-time availability", "Instant booking confirmation", "Flexible date selection", "Room type comparison"],
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "Resident Management",
      description: "Comprehensive resident profile management. Track resident information, assignment details, and stay history all in one place.",
      features: ["Digital resident profiles", "Stay history tracking", "Document management", "Easy check-in/check-out"],
    },
    {
      icon: <CreditCard className="w-10 h-10 text-primary" />,
      title: "Payment Processing",
      description: "Secure and efficient payment processing via Paystack. Handle deposits, top-ups, and full payments with detailed transaction records.",
      features: ["Secure payments", "Multiple payment options", "Transaction history", "Automatic receipts"],
    },
  ]

  return (
    <section ref={ref} className="py-16 bg-white md:py-24 dark:bg-zinc-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">What We Offer</h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            Our platform provides everything you need to manage hostel operations efficiently or find your perfect accommodation.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-8 transition-all duration-300 bg-white rounded-xl shadow-md border border-border dark:bg-zinc-800 hover:shadow-xl"
            >
              <div className="mb-6 p-4 rounded-lg bg-forest-green-100 dark:bg-forest-green-900/30 w-fit">
                {service.icon}
              </div>
              <h3 className="mb-3 text-2xl font-semibold">{service.title}</h3>
              <p className="mb-6 text-zinc-600 dark:text-zinc-400">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyChooseUsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Secure & Reliable",
      description: "Your data and payments are protected with enterprise-grade security measures.",
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-primary" />,
      title: "24/7 Support",
      description: "Our dedicated support team is always ready to assist you with any issues.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Fast & Easy",
      description: "Streamlined processes ensure you can book or manage in minutes, not hours.",
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Wide Network",
      description: "Access hostels across multiple regions with growing partnerships.",
    },
  ]

  return (
    <section ref={ref} className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-800">
      <SEOHelmet
        title="Services - Fuse"
        description="Explore our comprehensive hostel management services including listings, booking, resident management, and payment processing."
        keywords="services, hostels, booking, management, Fuse"
      />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Why Choose Fuse</h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            We're committed to providing the best hostel management and booking experience possible.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 transition-all duration-300 bg-white rounded-lg shadow-md dark:bg-zinc-900 hover:shadow-lg"
            >
              <div className="mb-4 p-3 rounded-lg bg-forest-green-100 dark:bg-forest-green-900/30 w-fit">
                {benefit.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 bg-primary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80">
            Whether you're looking for a place to stay or want to list your hostel, Fuse has you covered.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.a
              href="/find-hostel"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 text-primary font-semibold bg-white rounded-lg shadow-md hover:bg-zinc-100 transition-colors"
            >
              Find a Hostel
            </motion.a>
            <motion.a
              href="/hostel-listing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 text-white font-semibold bg-foreground rounded-lg shadow-md hover:bg-zinc-800 transition-colors"
            >
              List Your Hostel
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
