"use client"

import { ChevronsUpDown } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { LogoutIcon } from "@/components/animateIcons/Logout"
import { UserIcon } from "@/components/animateIcons/User"
import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/useAuthStore"
import { getUserById } from "@/api/users"
import { cn } from "@/lib/utils"

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const { data: User } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const userId = localStorage.getItem("userId")
      if (!userId) return null
      return await getUserById(userId)
    },
  })

  const handleLogout = async () => {
    logout()
  }

  return (
    <div className="px-3 py-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
                <Avatar className="h-9 w-9 rounded-xl border-2 border-background shadow-sm">
                  <AvatarImage src={User?.imageUrl || undefined} alt={User?.name || undefined} />
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white text-sm font-semibold">
                    {User?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-semibold truncate text-foreground">{User?.name || "User Name"}</span>
                  <span className="text-xs truncate text-muted-foreground">{User?.email || "User Email"}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-border/50 bg-background/95 backdrop-blur-sm shadow-xl"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-3 py-2 text-left text-sm">
                  <Avatar className="h-9 w-9 rounded-xl border-2 border-background shadow-sm">
                    <AvatarImage src={User?.imageUrl || undefined} alt={User?.name || undefined} />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white text-sm font-semibold">
                      {User?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-sm leading-tight">
                    <span className="font-semibold">{User?.name}</span>
                    <span className="text-xs text-muted-foreground">{User?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/dashboard/profile")} className="rounded-lg cursor-pointer">
                  <UserIcon label="Account" />
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer">
                <LogoutIcon label="Logout" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
