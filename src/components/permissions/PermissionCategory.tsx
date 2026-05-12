"use client"

import { useState } from "react"
import { 
  Building2, 
  DoorOpen, 
  Users, 
  CalendarDays, 
  CreditCard, 
  UserCog, 
  UserCheck, 
  Wrench, 
  FileBarChart, 
  Settings, 
  Users2, 
  Bell, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PermissionItem {
  key: string
  label: string
  enabled: boolean
  description?: string
}

interface CategoryPermissions {
  [key: string]: boolean
}

interface PermissionCategoryProps {
  category: string
  label: string
  permissions: PermissionItem[]
  onPermissionChange: (permission: string, checked: boolean) => void
  onSelectAll?: () => void
  onClearAll?: () => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  hostels: <Building2 className="w-5 h-5" />,
  rooms: <DoorOpen className="w-5 h-5" />,
  residents: <Users className="w-5 h-5" />,
  reservations: <CalendarDays className="w-5 h-5" />,
  payments: <CreditCard className="w-5 h-5" />,
  staff: <UserCog className="w-5 h-5" />,
  visitors: <UserCheck className="w-5 h-5" />,
  maintenance: <Wrench className="w-5 h-5" />,
  reports: <FileBarChart className="w-5 h-5" />,
  settings: <Settings className="w-5 h-5" />,
  users: <Users2 className="w-5 h-5" />,
  announcements: <Bell className="w-5 h-5" />,
  services: <Sparkles className="w-5 h-5" />
}

const actionColors: Record<string, string> = {
  view: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  view_all: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  view_own: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  create: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  edit: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  edit_own: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  confirm: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  cancel: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  approve: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  reject: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  export: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  manage: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  verify: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  check_in: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300",
  check_out: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  refund: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  assign: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  resolve: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  reset_password: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300"
}

function formatAction(action: string): string {
  return action.replace(/_/g, " ")
}

export function PermissionCategory({
  category,
  label,
  permissions,
  onPermissionChange,
  onSelectAll,
  onClearAll
}: PermissionCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [hoveredPerm, setHoveredPerm] = useState<string | null>(null)

  const enabledCount = permissions.filter(p => p.enabled).length
  const allEnabled = enabledCount === permissions.length
  const someEnabled = enabledCount > 0 && !allEnabled

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card animate-fade-in-up">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-forest-green-100 text-forest-green-600 dark:bg-forest-green-900/40 dark:text-forest-green-400">
            {categoryIcons[category] || <Settings className="w-5 h-5" />}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">{label}</h3>
            <p className="text-xs text-muted-foreground">
              {enabledCount} of {permissions.length} enabled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              allEnabled && "bg-forest-green-100 text-forest-green-700 dark:bg-forest-green-900/40 dark:text-forest-green-300",
              someEnabled && "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
            )}
          >
            {enabledCount}/{permissions.length}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border/60 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Permissions</span>
            <div className="flex gap-2">
              <button
                onClick={onSelectAll}
                className="text-xs text-forest-green-600 hover:text-forest-green-700 font-medium transition-colors"
              >
                Select All
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={onClearAll}
                className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {permissions.map((perm) => {
              const action = perm.key.split(".")[1]
              const actionColor = actionColors[action] || "bg-muted text-muted-foreground"
              
              return (
                <TooltipProvider key={perm.key} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onPermissionChange(perm.key, !perm.enabled)}
                        onMouseEnter={() => setHoveredPerm(perm.key)}
                        onMouseLeave={() => setHoveredPerm(null)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                          perm.enabled 
                            ? "border-forest-green-300 bg-forest-green-50/50 dark:bg-forest-green-950/20" 
                            : "border-border/60 bg-muted/20 hover:border-muted-foreground/30",
                          hoveredPerm === perm.key && "shadow-sm scale-[1.02]"
                        )}
                      >
                        <div className={cn(
                          "flex-shrink-0 transition-colors",
                          perm.enabled ? "text-forest-green-500" : "text-muted-foreground/50"
                        )}>
                          {perm.enabled ? (
                            <CheckSquare className="w-5 h-5 animate-scale-in" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <span className={cn(
                            "text-sm font-medium block truncate",
                            perm.enabled ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {perm.label}
                          </span>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block",
                            actionColor
                          )}>
                            {formatAction(action)}
                          </span>
                        </div>
                      </button>
                    </TooltipTrigger>
                    {perm.description && (
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p className="text-xs">{perm.description}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}