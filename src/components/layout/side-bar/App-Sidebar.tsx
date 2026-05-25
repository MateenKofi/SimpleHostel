import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { NavLogout } from "./nav-logout"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const ToggleIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="border-border/70 shadow-xl shadow-forest-green-950/5"
      {...props}
    >
      <SidebarHeader className="border-b border-border/60 px-2 pb-3 pt-2">
        <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:justify-center">
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Navigation
            </p>
          </div>
          <SidebarTrigger
            className="h-8 w-8 rounded-lg border border-border/70 bg-background shadow-sm hover:bg-forest-green-50 hover:text-forest-green-700"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ToggleIcon className="h-4 w-4" />
          </SidebarTrigger>
        </div>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="py-2">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/60 px-2 pb-2 pt-3">
        <NavLogout />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
