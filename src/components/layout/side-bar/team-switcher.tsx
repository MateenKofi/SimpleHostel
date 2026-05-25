"use client"

import { DropdownMenu } from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query"
import { getHostelById } from "@/api/hostels"
import { cn } from "@/lib/utils"
import { BadgeCheck } from "lucide-react"

export function TeamSwitcher() {
  const user_role = localStorage.getItem("role")
  const hostelId = localStorage.getItem("hostelId")

  const { data } = useQuery({
    queryKey: ["hostel"],
    queryFn: async () => {
      const responseData = await getHostelById(hostelId!)
      return responseData?.data
    },
    enabled: user_role === "admin" && !!hostelId,
  })

  const calendarYearId = data?.CalendarYear?.[0]?.id || null
  if (calendarYearId) {
    localStorage.setItem("calendarYear", calendarYearId)
  }

  const roleLabel = (user_role || "dashboard").replace("_", " ")
  const displayName = data?.name || "Fuse"
  const displaySubtext = data?.email || roleLabel

  return (
    <div className="px-2 py-2">
      <SidebarMenu className="gap-1.5">
        <SidebarMenuItem>
          <DropdownMenu>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "w-full rounded-xl border border-border/60 bg-background/70 px-3 py-3 h-auto shadow-sm transition-all duration-200",
                "hover:!bg-forest-green-50 hover:!shadow-md",
                "dark:hover:!bg-forest-green-900",
                "data-[state=open]:bg-forest-green-100 data-[state=open]:shadow-md",
                "dark:data-[state=open]:bg-forest-green-800"
              )}
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                <img
                  src={data?.logoUrl || "/logo.png"}
                  alt="logo"
                  className="size-7 rounded-md object-cover"
                />
              </div>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="flex items-center gap-1.5 font-semibold truncate text-foreground">
                  {displayName}
                  {data?.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                </span>
                <span className="text-xs truncate text-muted-foreground">
                  {displaySubtext}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
