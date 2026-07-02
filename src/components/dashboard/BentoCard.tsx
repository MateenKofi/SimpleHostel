import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export type BentoVariant =
  | 'default'
  | 'revenue'
  | 'occupancy'
  | 'debt'
  | 'residents'
  | 'staff'
  | 'glass'
  | 'outline'

interface BentoCardProps {
  children: ReactNode
  variant?: BentoVariant
  className?: string
  colSpan?: 1 | 2 | 3 | 4
  rowSpan?: 1 | 2 | 3
  noPadding?: boolean
  hover?: boolean
  delay?: number
  backgroundImage?: string
}

/**
 * Modern bento-grid card base component
 * Features subtle borders, hover effects, gradient backgrounds, and smooth animations
 */
const BentoCard = ({
  children,
  variant = 'default',
  className,
  colSpan = 1,
  rowSpan = 1,
  noPadding = false,
  hover = true,
  delay = 0,
  backgroundImage,
}: BentoCardProps) => {
  const variantStyles: Record<BentoVariant, string> = {
    default: 'bg-card border-border/80 hover:border-primary/30',
    revenue: 'bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-950/20 dark:to-teal-950/10 border-emerald-200/50 dark:border-emerald-800/30 hover:border-emerald-400/50',
    occupancy: 'bg-gradient-to-br from-forest-green-50/80 to-forest-green-50/60 dark:from-forest-green-950/20 dark:to-forest-green-950/10 border-forest-green-200/50 dark:border-forest-green-800/30 hover:border-forest-green-400/50',
    debt: 'bg-gradient-to-br from-amber-50/80 to-warm-red-50/60 dark:from-amber-950/20 dark:to-warm-red-950/10 border-amber-200/50 dark:border-amber-800/30 hover:border-amber-400/50',
    residents: 'bg-gradient-to-br from-forest-green-50/80 to-teal-green-50/60 dark:from-forest-green-950/20 dark:to-teal-green-950/10 border-forest-green-200/50 dark:border-forest-green-800/30 hover:border-forest-green-400/50',
    staff: 'bg-gradient-to-br from-teal-green-50/80 to-forest-green-50/60 dark:from-teal-green-950/20 dark:to-forest-green-950/10 border-teal-green-200/50 dark:border-teal-green-800/30 hover:border-teal-green-400/50',
    glass: 'bg-white/40 dark:bg-black/20 backdrop-blur-sm border-border/50',
    outline: 'bg-transparent border-border/80 hover:bg-muted/30',
  }

  return (
    <div
      className={cn(
        'rounded-2xl border',
        variantStyles[variant],
        hover && 'hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.01]',
        'opacity-0 animate-fade-in-up',
        colSpan > 1 && `md:col-span-${colSpan}`,
        rowSpan > 1 && `md:row-span-${rowSpan}`,
        !noPadding && 'p-5',
        backgroundImage && 'relative overflow-hidden',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 opacity-[0.07] bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default BentoCard
