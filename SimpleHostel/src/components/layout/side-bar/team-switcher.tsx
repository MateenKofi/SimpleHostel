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

export function TeamSwitcher() {
  const user_role = localStorage.getItem("role")
  if (user_role !== "ADMIN") return null

  const hostelId = localStorage.getItem("hostelId")

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useQuery({
    queryKey: ["hostel"],
    queryFn: async () => {
      const responseData = await getHostelById(hostelId!)
      return responseData?.data
    },
    enabled: !!hostelId,
  })

  const calendarYearId = data?.CalendarYear?.[0]?.id || null
  localStorage.setItem("calendarYear", calendarYearId)

  return (
    <div className="px-3 py-3">
      <SidebarMenu className="gap-1.5">
        <SidebarMenuItem>
          <DropdownMenu>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "w-full rounded-xl transition-all duration-200 py-3 px-4 h-auto",
                "hover:!bg-forest-green-100 hover:!shadow-sm",
                "dark:hover:!bg-forest-green-900",
                "data-[state=open]:bg-forest-green-200 data-[state=open]:shadow-sm",
                "dark:data-[state=open]:bg-forest-green-800"
              )}
            >
              <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10">
                <img
                  src={data?.logoUrl || "/logo.png"}
                  alt="logo"
                  className="size-6 rounded-md object-cover"
                />
              </div>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-semibold truncate text-foreground">
                  {data?.name || "Fuse"}
                </span>
                <span className="text-xs truncate text-muted-foreground">
                  {data?.email || "Dashboard"}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
