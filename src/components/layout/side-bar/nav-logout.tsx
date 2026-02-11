"use client"

import { LogOut } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"
import { cn } from "@/lib/utils"

export function NavLogout() {
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="px-3 py-3">
      <SidebarMenu className="gap-1.5">
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => logout()}
            tooltip="Log Out"
            className={cn(
              "w-full rounded-xl transition-all duration-200 py-3 px-4 h-auto",
              "hover:bg-destructive/10 hover:text-destructive hover:shadow-sm",
              "text-muted-foreground"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="font-medium text-sm">Log Out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}

export default NavLogout
