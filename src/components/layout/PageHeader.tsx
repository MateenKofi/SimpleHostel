import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  icon?: LucideIcon
  actions?: ReactNode
  showBackButton?: boolean
  sticky?: boolean
}

export function PageHeader({ title, subtitle, description, icon: Icon, actions, showBackButton, sticky }: PageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ${sticky ? "sticky top-0 bg-background z-10 py-4 -mx-6 px-6 border-b border-border" : ""}`}>
      <div className="flex items-center gap-3">
        {Icon && <div className="p-2 bg-primary/10 rounded-lg"><Icon className="w-5 h-5 text-primary" /></div>}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {(subtitle || description) && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle || description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
