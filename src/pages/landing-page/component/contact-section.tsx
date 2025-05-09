import { Facebook, Instagram, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState } from "react"

export function ContactSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [isHovered, setIsHovered] = useState({
    facebook: false,
    instagram: false,
    phone: false,
    email: false,
    location: false,
  })

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const socialIconVariants = {
    hover: { scale: 1.2, rotate: 5 },
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="bg-zinc-900 text-white py-12 sm:py-16 px-4 rounded-3xl relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 8,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-40 h-40 bg-red-500 rounded-full opacity-10"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -10, 0],
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 6,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="container max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to <span className="text-red-500">Get Started</span>?
          </h2>
          <p className="text-zinc-400 text-lg">
            Find your perfect hostel and start your adventure. Let's make your travel dreams a reality!
          </p>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
            Book Your Stay
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0"
        >
          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="Follow us on Facebook"
              variants={socialIconVariants}
              whileHover="hover"
              onHoverStart={() => setIsHovered({ ...isHovered, facebook: true })}
              onHoverEnd={() => setIsHovered({ ...isHovered, facebook: false })}
            >
              <Facebook className="w-6 h-6" />
              {isHovered.facebook && (
                <motion.span
                  className="absolute bg-zinc-800 text-white text-xs px-2 py-1 rounded -mt-8 ml-[-10px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Facebook
                </motion.span>
              )}
            </motion.a>
            <motion.a
              href="#"
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="Follow us on Instagram"
              variants={socialIconVariants}
              whileHover="hover"
              onHoverStart={() => setIsHovered({ ...isHovered, instagram: true })}
              onHoverEnd={() => setIsHovered({ ...isHovered, instagram: false })}
            >
              <Instagram className="w-6 h-6" />
              {isHovered.instagram && (
                <motion.span
                  className="absolute bg-zinc-800 text-white text-xs px-2 py-1 rounded -mt-8 ml-[-15px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Instagram
                </motion.span>
              )}
            </motion.a>
          </div>

          <motion.div
            className="h-12 w-12 order-first sm:order-none"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <img
              src="/logo.png"
              alt="HostelFinder Logo"
              className="w-full h-full object-contain bg-white rounded-full"
            />
          </motion.div>

          <motion.div className="text-zinc-400" whileHover={{ scale: 1.05 }}>
            <a href="tel:+1234567890" className="hover:text-white transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" />
              (+233) 54 398 3427
            </a>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-8 text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} HostelFinder. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
