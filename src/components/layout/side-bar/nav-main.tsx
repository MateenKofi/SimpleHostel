"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BedDouble,
  BookOpenCheck,
  List,
  CalendarCheck,
  Wrench,
  Users,
  CheckSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export function NavMain() {
  const { data: userProfile, isLoading, isError } = useQuery<any>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await axios.get('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response?.data;
    },
  });

  const navMain = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Room Management", icon: BedDouble, path: "/dashboard/room-management" },
    { title: "Resident Management", icon: BookOpenCheck, path: "/dashboard/resident-management" },
    { title: "Debtors List", icon: List, path: "/dashboard/debtors-list" },
    { title: "Visitor Management", icon: CalendarCheck, path: "/dashboard/visitor-management" },
    { title: "Maintenance & Tracking", icon: Wrench, path: "/dashboard/maintenance-and-tracking" },
    { title: "Staff Management", icon: Users, path: "/dashboard/staff-management" },
  ];

  if (userProfile?.restofUser?.role === "SUPER_ADMIN") {
    navMain.push({ title: "Approve Hostel", icon: CheckSquare, path: "/dashboard/approve-hostel" });
  }


  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {navMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link to={item.path} className="flex items-center gap-2">
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
