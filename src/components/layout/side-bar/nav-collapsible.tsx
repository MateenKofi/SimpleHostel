"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

interface NavCollapsibleProps {
  title: string
  items: NavItem[]
  defaultOpen?: boolean
}

export function NavCollapsible({ title, items, defaultOpen = false }: NavCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarGroup className="p-0">
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer flex items-center justify-between w-full pr-2 transition-colors duration-150">
            <span>{title}</span>
            <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-90")} />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                    className={cn(
                      "transition-all duration-150",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      pathname === item.path && "border-l-2 border-primary bg-primary/5 font-medium"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
      <SidebarSeparator className="mx-2 bg-sidebar-border/50" />
    </Collapsible>
  )
}
