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
import {useNavigate} from 'react-router-dom'
import { LogoutIcon } from "@/components/animateIcons/Logout"
import { BellIcon } from "@/components/animateIcons/bell"
import { UserIcon } from "@/components/animateIcons/User"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import {useUserStore} from '@/controllers/UserStore'
// import { useEffect } from "react"
// import toast from "react-hot-toast"

export function NavUser() {

  const { isMobile } = useSidebar()
  const navigate = useNavigate()
 const logout = useUserStore((state) => state.logout)
  const { data:User } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const userId = localStorage.getItem('userId')
      const response = await axios.get(`/api/users/get/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response?.data;
    },
  });

 
  // useEffect(() => {
  //   if (User?.changedPassword === false) {
  //     toast('You are using default password. Change password')
  //     navigate('/dashboard/profile')
  //   }
  // }, [User,navigate])

  const handlelogout = async () => {
    logout()
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={User?.imageUrl} alt={User?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{User?.name || 'User Name'}</span>
                <span className="truncate text-xs">{User?.email|| 'User Email'}</span>
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
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={User?.imageUrl} alt={User?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{User?.name}</span>
                  <span className="truncate text-xs">{User?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
              onClick={()=>navigate('/dashboard/profile')}
              >
                <UserIcon label="Account"/>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon label="Notification"/>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            onClick={handlelogout}
            >
              <LogoutIcon label="Logout"/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

