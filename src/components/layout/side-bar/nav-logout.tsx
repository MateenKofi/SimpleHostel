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
    <div className="px-3 py-3">
      <SidebarMenu className="gap-1.5">
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogout}
            disabled={isLoggingOut}
            tooltip="Log Out"
            className={cn(
              "w-full rounded-xl transition-all duration-200 py-3 px-4 h-auto",
              "hover:bg-destructive/10 hover:text-destructive hover:shadow-sm",
              "text-muted-foreground",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoggingOut ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5 shrink-0" />
            )}
            <span className="font-medium text-sm">
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}

export default NavLogout
