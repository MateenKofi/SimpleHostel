import { ReactNode } from "react"
import { LucideIcon, ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  icon?: LucideIcon
  actions?: ReactNode
  showBackButton?: boolean
  sticky?: boolean
}

PageHeader.defaultProps = {
  sticky: true,
}

export function PageHeader({ title, subtitle, description, icon: Icon, actions, showBackButton, sticky }: PageHeaderProps) {
  const navigate = useNavigate()

  const content = (
    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        {Icon && <div className="p-2 bg-primary/10 rounded-lg shrink-0 hidden sm:block"><Icon className="w-5 h-5 text-primary" /></div>}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate">{title}</h1>
          {(subtitle || description) && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2">{subtitle || description}</p>
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
      <div className="sticky top-0 bg-background z-10 border-b border-border mx-2 sm:mx-6 mb-4 sm:mb-4">
        {content}
      </div>
    )
  }

  return (
    <div className="mb-4 sm:mb-6 mx-2 sm:mx-4">
      {content}
    </div>
  )
}
