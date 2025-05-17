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
const hostelId = localStorage.getItem('hostelId')
  const { data } = useQuery({
    queryKey: ["hostel"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/hostels/get/${hostelId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
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
            <div className="flex aspect-square size-16 items-center justify-center ">
              <img src={data?.imageUrl || "/logo.png"} alt="logo" className="rounded-lg"/>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {data?.name || "Fuse"}
              </span>
              <span className="truncate text-xs">
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
