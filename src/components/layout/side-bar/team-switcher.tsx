"use client";

import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function TeamSwitcher() {
  const user_role = localStorage.getItem('role')
  if (user_role !== 'ADMIN') return null;
  
const hostelId = localStorage.getItem('hostelId')


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useQuery({
    queryKey: ["hostel"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/hostels/get/${hostelId}`
      );
      return response?.data?.data;
    },
    enabled : !!hostelId
  });

  const calendarYearId = data?.CalendarYear?.[0]?.id || null;
  localStorage.setItem('calendarYear',calendarYearId)
  return (
    <SidebarMenu className="border-b-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex items-center justify-center aspect-auto size-10">
              <img src={data?.logoUrl || "/logo.png"} alt="logo" className="p-1 rounded-full"/>
            </div>
            <div className="grid flex-1 text-sm leading-tight text-left">
              <span className="font-semibold truncate">
                {data?.name || "Fuse"}
              </span>
              <span className="text-xs truncate">
                {" "}
                {data?.email || "Dashboard"}
              </span>
            </div>
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
