"use client"

import * as React from "react"
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal, LayoutDashboard, BedDouble, BookOpenCheck, List, CalendarCheck, Wrench, BarChart3, Users } from 'lucide-react'

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Room Management', icon: BedDouble, path: '/dashboard/room-management' },
    { title: 'Resident Management', icon: BookOpenCheck, path: '/dashboard/resident-management' },
    { title: 'Deptors List', icon: List, path: '/dashboard/deptors-list' },
    { title: 'Visitor Management', icon: CalendarCheck, path: '/dashboard/visitor-management' },
    { title: 'Maintenance & Tracking', icon: Wrench, path: '/dashboard/maintenance-and-tracking' },
    { title: 'Staff Management', icon: Users, path: '/dashboard/staff-management' },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher  />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

