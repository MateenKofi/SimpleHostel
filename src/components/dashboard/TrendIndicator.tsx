import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TrendDirection = 'up' | 'down' | 'neutral'

interface TrendIndicatorProps {
  value?: number // Percentage change
  label?: string
  direction?: TrendDirection
  className?: string
  showIcon?: boolean
}

/**
 * Reusable trend indicator badge showing positive/negative/neutral changes
 * Color-coded: green (positive), red (negative), gray (neutral)
 */
const TrendIndicator = ({
  value,
  label = 'vs last month',
  direction,
  className,
  showIcon = true,
}: TrendIndicatorProps) => {
  // Auto-detect direction from value if not provided
  const detectedDirection: TrendDirection =
    direction ?? (value === undefined ? 'neutral' : value > 0 ? 'up' : value < 0 ? 'down' : 'neutral')

  const config = {
    up: {
      icon: TrendingUp,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      iconColor: 'text-emerald-600 dark:text-emerald-500',
      sign: '+',
    },
    down: {
      icon: TrendingDown,
      bgColor: 'bg-warm-red-50 dark:bg-warm-red-950/30',
      textColor: 'text-warm-red-700 dark:text-warm-red-400',
      iconColor: 'text-warm-red-600 dark:text-warm-red-500',
      sign: '',
    },
    neutral: {
      icon: Minus,
      bgColor: 'bg-muted',
      textColor: 'text-muted-foreground',
      iconColor: 'text-muted-foreground',
      sign: '',
    },
  }

  const { icon: Icon, bgColor, textColor, iconColor, sign } = config[detectedDirection]

  if (value === undefined && direction === undefined) {
    return null
  }

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', bgColor, textColor, className)}>
      {showIcon && <Icon className={cn('h-3.5 w-3.5', iconColor)} />}
      <span>
        {sign}
        {value !== undefined ? Math.abs(value).toFixed(1) : '0.0'}% {label}
      </span>
    </div>
  )
}

export default TrendIndicator
