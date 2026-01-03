"use client"

import {
  ChevronsUpDown,
} from "lucide-react"

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
import { useNavigate } from 'react-router-dom'
import { LogoutIcon } from "@/components/animateIcons/Logout"
// import { BellIcon } from "@/components/animateIcons/bell"
import { UserIcon } from "@/components/animateIcons/User"
import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from '@/stores/useAuthStore'
import { getUserById } from "@/api/users"

export function NavUser() {

  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const logout = useAuthStore((state: any) => state.logout)
  const { data: User } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) return null
      return await getUserById(userId)
    },
  });


  const handlelogout = async () => {
    logout()
  }
  return (
    <SidebarMenu className="border-t-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="w-8 h-8 rounded-lg">
                <AvatarImage src={User?.imageUrl || undefined} alt={User?.name || undefined} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-semibold truncate">{User?.name || 'User Name'}</span>
                <span className="text-xs truncate">{User?.email || 'User Email'}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="w-8 h-8 rounded-lg">
                  <AvatarImage src={User?.imageUrl || undefined} alt={User?.name || undefined} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-semibold truncate">{User?.name}</span>
                  <span className="text-xs truncate">{User?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate('/dashboard/profile')}
              >
                <UserIcon label="Account" />
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <BellIcon label="Notification"/>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handlelogout}
            >
              <LogoutIcon label="Logout" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

