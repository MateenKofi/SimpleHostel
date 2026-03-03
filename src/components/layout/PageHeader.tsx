import { ReactNode } from "react"
import { LucideIcon, ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export type PageHeaderVariant = "default" | "colored"

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  icon?: LucideIcon
  actions?: ReactNode
  showBackButton?: boolean
  sticky?: boolean
  variant?: PageHeaderVariant
}

PageHeader.defaultProps = {
  sticky: true,
  variant: "default",
}

export function PageHeader({
  title,
  subtitle,
  description,
  icon: Icon,
  actions,
  showBackButton,
  sticky,
  variant = "default"
}: PageHeaderProps) {
  const navigate = useNavigate()

  // Variant styles
  const variantStyles = {
    default: {
      container: "bg-card border-border",
      iconBg: "bg-muted",
      title: "text-foreground",
    },
    colored: {
      container: "bg-primary border-primary-foreground/20",
      iconBg: "bg-primary-foreground/20",
      title: "text-primary-foreground",
    },
  }

  const styles = variantStyles[variant]

  const content = (
    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 sm:py-5">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {showBackButton && (
          <Button
            variant={variant === "colored" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        {Icon && (
          <div className={`p-2.5 ${styles.iconBg} rounded-xl shrink-0 hidden sm:block`}>
            <Icon className={`w-5 h-5 ${variant === "colored" ? "text-primary-foreground" : "text-primary"}`} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className={`text-xl sm:text-2xl font-semibold ${styles.title} truncate`}>{title}</h1>
          {(subtitle || description) && (
            <p className={`text-xs sm:text-sm ${
              variant === "colored" ? "text-primary-foreground/80" : "text-muted-foreground"
            } mt-1 line-clamp-2`}>
              {subtitle || description}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )

  if (sticky) {
    return (
      <div className={`sticky top-0 z-10 border-b ${styles.container} mx-2 sm:mx-6 mb-4 rounded-t-lg backdrop-blur-sm`}>
        {content}
      </div>
    )
  }

  return (
    <div className={`mb-6 mx-2 sm:mx-4 ${variant === "colored" ? "" : "border border-border"} rounded-lg`}>
      {content}
    </div>
  )
}
