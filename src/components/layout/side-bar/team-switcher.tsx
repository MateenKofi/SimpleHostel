"use client";

import * as React from "react";

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

  const { data } = useQuery({
    queryKey: ["hostel"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/hostels/${localStorage.getItem("hostelId")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response?.data?.data;
    },
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-full">
              <img src={data?.hostel?.imageUrl || "/logo.png"} alt="" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {data?.hostel?.name || "Fuse"}
              </span>
              <span className="truncate text-xs">
                {" "}
                {data?.hostel?.email || "Dashboard"}
              </span>
            </div>
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
