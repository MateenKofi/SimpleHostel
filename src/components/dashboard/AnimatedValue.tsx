import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

export type ValueFormat = 'number' | 'currency' | 'percentage'

interface AnimatedValueProps {
  value: number
  format?: ValueFormat
  duration?: number // Animation duration in ms
  className?: string
  decimals?: number
  prefix?: string
  suffix?: string
}

/**
 * Smooth count-up animation for numeric values
 * Supports currency and percentage formatting
 */
const AnimatedValue = ({
  value,
  format = 'number',
  duration = 1000,
  className,
  decimals = 0,
  prefix = '',
  suffix = '',
}: AnimatedValueProps) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const previousValue = useRef<number>(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    // Only animate on first render or significant value changes
    if (!hasAnimated || Math.abs(value - previousValue.current) > 0.01) {
      setHasAnimated(true)
      const startTime = performance.now()
      const startValue = hasAnimated ? previousValue.current : 0

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentValue = startValue + (value - startValue) * easeOut

        setDisplayValue(currentValue)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }

    previousValue.current = value
  }, [value, duration, hasAnimated])

  const formatValue = (val: number): string => {
    const rounded = Number(val.toFixed(decimals))

    switch (format) {
      case 'currency':
        return `${prefix}${rounded.toLocaleString('en-GH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
      case 'percentage':
        return `${rounded.toFixed(decimals)}%`
      default:
        return `${prefix}${rounded.toLocaleString()}${suffix}`
    }
  }

  return (
    <span className={cn('tabular-nums tracking-tight', className)}>
      {formatValue(displayValue)}
    </span>
  )
}

export default AnimatedValue
