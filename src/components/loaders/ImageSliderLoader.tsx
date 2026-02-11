interface SkeletonLoaderProps {
  height?: string
  className?: string
}

export function ImageSliderLoader({ height = "200px", className = "" }: SkeletonLoaderProps) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} style={{ height }} aria-hidden="true" />
}
