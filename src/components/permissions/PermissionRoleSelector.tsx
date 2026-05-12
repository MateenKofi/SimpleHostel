"use client"

import { useState } from "react"
import {
  Shield,
  UserCog,
  User,
  CheckCircle2,
  Crown
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RoleOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  isSystem?: boolean
}

interface PermissionRoleSelectorProps {
  roles: string[]
  selectedRole: string
  onRoleChange: (role: string) => void
  userRole?: string
  hostelName?: string
}

const roleConfig: Record<string, RoleOption> = {
  super_admin: {
    id: "super_admin",
    name: "Super Admin",
    description: "Full system access across all hostels",
    icon: <Crown className="w-4 h-4" />,
    isSystem: true
  },
  admin: {
    id: "admin",
    name: "Admin",
    description: "Manage single hostel with all permissions",
    icon: <Shield className="w-4 h-4" />,
    isSystem: true
  },
  staff: {
    id: "staff",
    name: "Staff",
    description: "Assigned tasks and limited access",
    icon: <UserCog className="w-4 h-4" />
  },
  resident: {
    id: "resident",
    name: "Resident",
    description: "Basic access to own data and features",
    icon: <User className="w-4 h-4" />
  }
}

export function PermissionRoleSelector({
  roles,
  selectedRole,
  onRoleChange,
  userRole,
  hostelName
}: PermissionRoleSelectorProps) {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  return (
    <div className="space-y-1">
      {roles.map((role) => {
        const config = roleConfig[role]
        if (!config) return null

        const isSelected = selectedRole === role
        const isAdminRestricted = userRole === "admin" && (role === "super_admin" || role === "admin")
        const isDisabled = isAdminRestricted
        const isHovered = hoveredRole === role

        return (
          <button
            key={role}
            onClick={() => !isDisabled && onRoleChange(role)}
            disabled={isDisabled}
            onMouseEnter={() => setHoveredRole(role)}
            onMouseLeave={() => setHoveredRole(null)}
            className={cn(
              "w-full relative flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200",
              "hover:bg-muted/50",
              isSelected 
                ? "bg-forest-green-50/50 dark:bg-forest-green-950/20" 
                : "hover:border-muted-foreground/30",
              isDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent hover:border-transparent"
            )}
          >
            <div className={cn(
              "flex-shrink-0 p-1.5 rounded-md transition-colors",
              isSelected 
                ? "bg-forest-green-500 text-white" 
                : isHovered && !isDisabled
                  ? "bg-forest-green-100 text-forest-green-600 dark:bg-forest-green-900/40 dark:text-forest-green-400"
                  : "bg-muted text-muted-foreground"
            )}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-medium truncate",
                  isSelected ? "text-forest-green-700 dark:text-forest-green-300" : "text-foreground"
                )}>
                  {config.name}
                </span>
                {config.isSystem && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded flex-shrink-0">
                    System
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {config.description}
                {userRole === "admin" && (role === "staff" || role === "resident") && hostelName && (
                  <span className="text-forest-green-600 dark:text-forest-green-400"> • {hostelName}</span>
                )}
              </p>
            </div>
            {isSelected && (
              <CheckCircle2 className="w-4 h-4 text-forest-green-500 flex-shrink-0" />
            )}
          </button>
        )
      })}
    </div>
  )
}