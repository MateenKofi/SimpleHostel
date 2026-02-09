import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon?: LucideIcon
  title: string
  content: string
  description?: string
  backgroundColor?: string
  titleColor?: string
  contentColor?: string
  descriptionColor?: string
  className?: string
}

export function StatCard({
  icon: Icon,
  title,
  content,
  description,
  backgroundColor = "bg-card",
  titleColor = "text-muted-foreground",
  contentColor = "text-foreground",
  descriptionColor = "text-muted-foreground",
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "w-full rounded-2xl border border-border/50 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        backgroundColor,
        className
      )}
    >
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="rounded-xl bg-gradient-to-br from-forest-green-50 to-forest-green-100/50 p-2.5">
                <Icon className="h-5 w-5 text-forest-green-700" />
              </div>
            )}
            <p className={cn("text-lg font-semibold", titleColor)}>{title}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className={cn("text-5xl font-extrabold tracking-tight", contentColor)}>{content}</p>
            {description && <p className={cn("text-sm", descriptionColor)}>{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

