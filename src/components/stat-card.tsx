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
  backgroundColor = "bg-purple-100",
  titleColor = "text-gray-500",
  contentColor = "text-gray-900",
  descriptionColor = "text-gray-500",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("w-full transition-all hover:shadow-md", backgroundColor, className)}>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex  gap-1">
            {Icon && <Icon className={cn("h-6 w-6 border rounded-full p-1", titleColor)} />}
            <p className={cn("text-xl font-bold", titleColor)}>{title}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className={cn("text-6xl font-extrabold tracking-tight", contentColor)}>{content}</p>
            {description && <p className={cn("text-sm", descriptionColor)}>{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

