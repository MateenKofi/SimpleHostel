import React, { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Users, Building, Globe, Award, TrendingUp, Star } from "lucide-react"
import AnimatedValue from "@/components/dashboard/AnimatedValue"
import TrendIndicator from "@/components/dashboard/TrendIndicator"

interface StatProps {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
  delay: number
  description?: string
  gradient: string
  iconBg: string
  trend?: number
}

function StatItem({ icon, value, suffix, label, delay, description, gradient, iconBg, trend }: StatProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="group relative"
    >
      {/* Card with gradient background */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${gradient}
      `} />

      <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Icon container */}
        <div className={`inline-flex p-3 rounded-xl ${iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        {/* Value with animation */}
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-foreground tracking-tight">
          <AnimatedValue value={value} duration={2000} />
          <span className="text-primary ml-1">{suffix}</span>
        </h3>

        {/* Label */}
        <p className="text-sm font-medium text-muted-foreground mb-3">{label}</p>

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground/70">{description}</p>
        )}

        {/* Trend indicator */}
        {trend !== undefined && (
          <div className="mt-4">
            <TrendIndicator value={trend} label="growth" direction="up" showIcon={true} className="text-xs" />
          </div>
        )}

        {/* Decorative glow effect */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
      </div>
    </motion.div>
  )
}

export function StatisticsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const stats = [
    {
      icon: <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      value: 500000,
      suffix: "+",
      label: "Happy Travelers",
      description: "From across the globe",
      delay: 0,
      gradient: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
      iconBg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",
      trend: 15,
    },
    {
      icon: <Building className="h-6 w-6 text-forest-green-700 dark:text-forest-green-400" />,
      value: 10000,
      suffix: "+",
      label: "Hostels Listed",
      description: "Verified & trusted",
      delay: 0.1,
      gradient: "bg-gradient-to-br from-forest-green-500/10 to-forest-green-500/10",
      iconBg: "bg-gradient-to-br from-forest-green-50 to-forest-green-50 dark:from-forest-green-950/30 dark:to-forest-green-950/20",
      trend: 8,
    },
    {
      icon: <Globe className="h-6 w-6 text-teal-green-600 dark:text-teal-green-400" />,
      value: 120,
      suffix: "",
      label: "Countries Covered",
      description: "6 continents explored",
      delay: 0.2,
      gradient: "bg-gradient-to-br from-teal-green-500/10 to-cyan-500/10",
      iconBg: "bg-gradient-to-br from-teal-green-50 to-cyan-50 dark:from-teal-green-950/30 dark:to-cyan-950/20",
      trend: 12,
    },
    {
      icon: <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      value: 98,
      suffix: "%",
      label: "Satisfaction Rate",
      description: "Based on reviews",
      delay: 0.3,
      gradient: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
      iconBg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20",
      trend: 3,
    },
  ]

  return (
    <section ref={ref} className="relative py-20 md:py-28 overflow-hidden">
      {/* Parallax background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-accent/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[40%] right-[30%] w-48 h-48 bg-teal-500/5 rounded-full blur-3xl"
        />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gradient">
            Best Suit by the Numbers
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Join our global community of travelers and hostel owners
          </p>
        </motion.div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>

        {/* Bottom accent line with animation */}
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: "200px" } : { width: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full mx-auto mt-16"
        />
      </div>
    </section>
  )
}
