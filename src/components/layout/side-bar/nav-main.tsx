"use client"
import { useNavigate } from "react-router-dom";
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
  Wallet2,
  LucideProps,
} from "lucide-react"
 
type navItems = {
  title: string;
  icon: React.ComponentType<LucideProps>;
  path: string;
}
export function NavMain() {
  const userRole = localStorage.getItem('role')
  const navigate = useNavigate();

  let navItems:navItems[] = [];

  if (userRole === 'ADMIN') {
    navItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { title: "Calendar Year", icon: Calendar, path: "/dashboard/calendar-year-management" },
      { title: "Room Management", icon: BedDouble, path: "/dashboard/room-management" },
      { title: "Resident Management", icon: BookOpenCheck, path: "/dashboard/resident-management" },
      { title: "Debtors List", icon: List, path: "/dashboard/debtors-list" },
      { title: "Visitor Management", icon: CalendarCheck, path: "/dashboard/visitor-management" },
      { title: "Maintenance & Tracking", icon: Wrench, path: "/dashboard/maintenance-and-tracking" },
      { title: "Staff Management", icon: Users, path: "/dashboard/staff-management" },
      { title: "Transactions", icon: Wallet2, path: '/dashboard/transactions' }
    ];
  } else if (userRole === "SUPER_ADMIN") {
    navItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { title: "Approve Hostel", icon: CheckSquare, path: "/dashboard/approve-hostel" },
      { title: "Transactions", icon: Wallet2, path: '/dashboard/transactions' },
      { title: "Users", icon: UserCog, path: "/dashboard/users" }
    ];
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              onClick={() => navigate(item.path)}
              tooltip={item.title}
              className="w-full transition-all duration-500 ease-in-out hover:bg-black hover:text-white hover:translate-x-2 rounded-md"
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