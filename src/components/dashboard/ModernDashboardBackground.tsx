import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ModernDashboardBackgroundProps {
  children: React.ReactNode
  className?: string
}

/**
 * Modern dashboard background with parallax scrolling effect
 * Provides a subtle gradient overlay for visual depth
 */
const ModernDashboardBackground = ({ children, className }: ModernDashboardBackgroundProps) => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Add passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={cn('relative min-h-screen overflow-hidden', className)}>
      {/* Parallax background layer */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      >
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Ambient gradient orbs for depth */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default ModernDashboardBackground
