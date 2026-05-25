"use client"

import { useState } from "react"
import { LogOut, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"
import { cn } from "@/lib/utils"

export function NavLogout() {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate("/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="px-2 py-2">
      <SidebarMenu className="gap-1.5">
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogout}
            disabled={isLoggingOut}
            tooltip="Log Out"
            className={cn(
              "group/logout relative h-11 w-full overflow-hidden rounded-xl border border-transparent px-3 py-2",
              "text-muted-foreground transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              "hover:border-destructive/15 hover:bg-destructive/10 hover:text-destructive hover:shadow-sm",
              "focus-visible:ring-2 focus-visible:ring-destructive/30",
              "disabled:cursor-not-allowed disabled:opacity-60",
              "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-transparent before:transition-colors before:duration-300",
              "hover:before:bg-destructive/70"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                "bg-muted/70 text-muted-foreground transition-all duration-300",
                "group-hover/logout:bg-destructive/15 group-hover/logout:text-destructive",
                "motion-safe:group-hover/logout:translate-x-0.5"
              )}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 shrink-0" />
              )}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">
              {isLoggingOut ? "Signing out..." : "Log out"}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-destructive/30 opacity-0 transition-opacity duration-300 group-hover/logout:opacity-100" />
            <span className="sr-only">
              {isLoggingOut ? "Signing out" : "Log out"}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}

export default NavLogout
