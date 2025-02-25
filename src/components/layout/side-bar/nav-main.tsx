"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  BedDouble,
  BookOpenCheck,
  List,
  CalendarCheck,
  Wrench,
  Users,
  CheckSquare,
  Calendar,
  UserCog,
} from "lucide-react"
import { useUserStore, useUserProfile } from "../../../controllers/UserStore";



export function NavMain() {
  const { isLoading, isError } = useUserProfile();
  const userProfile = localStorage.getItem('userProfile')
 

  const navMain = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Calendar Year", icon: Calendar, path: "/dashboard/calendar-year-management" },
    { title: "Room Management", icon: BedDouble, path: "/dashboard/room-management" },
    { title: "Resident Management", icon: BookOpenCheck, path: "/dashboard/resident-management" },
    { title: "Debtors List", icon: List, path: "/dashboard/debtors-list" },
    { title: "Visitor Management", icon: CalendarCheck, path: "/dashboard/visitor-management" },
    { title: "Maintenance & Tracking", icon: Wrench, path: "/dashboard/maintenance-and-tracking" },
    { title: "Staff Management", icon: Users, path: "/dashboard/staff-management" },
  ]

  if (userProfile === "SUPER_ADMIN") {
    navMain.push({ title: "Approve Hostel", icon: CheckSquare, path: "/dashboard/approve-hostel" })
    navMain.push({ title: "Super Admin", icon: UserCog, path: "/dashboard/approve-hostel" })
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {navMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              onClick={() => (window.location.href = item.path)}
              tooltip={item.title}
              className="w-full transition duration-700 ease-in-out hover:bg-black hover:text-white hover:translate-x-2 rounded-md"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

