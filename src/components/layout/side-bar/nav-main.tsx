"use client"
import { useNavigate, useLocation } from "react-router-dom"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  BedDouble,
  BookOpenCheck,
  CalendarCheck,
  Users,
  CheckSquare,
  Calendar,
  UserCog,
  Wallet2,
  Hotel,
  Settings,
  LucideProps,
  Axis3D,
  House,
  GitPullRequest,
  HandCoins,
  Megaphone,
  Wrench,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  icon: React.ComponentType<LucideProps>
  path: string
}

export function NavMain() {
  const userRole = localStorage.getItem("role")
  const navigate = useNavigate()
  const { pathname } = useLocation()

  let navItems: NavItem[] = []

  if (userRole === "admin") {
    navItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { title: "Calendar Year", icon: Calendar, path: "/dashboard/calendar-year-management" },
      { title: "Room Management", icon: BedDouble, path: "/dashboard/room-management" },
      { title: "Maintenance", icon: Wrench, path: "/dashboard/maintenance" },
      { title: "Announcements", icon: Megaphone, path: "/dashboard/announcement-dashboard" },
      { title: "Residents", icon: BookOpenCheck, path: "/dashboard/resident-management" },
      { title: "Visitors", icon: CalendarCheck, path: "/dashboard/visitor-management" },
      { title: "Staff", icon: Users, path: "/dashboard/staff-management" },
      { title: "Transactions", icon: Wallet2, path: "/dashboard/transactions" },
      { title: "Debtors List", icon: AlertCircle, path: "/dashboard/deptors-list" },
      { title: "Settings", icon: Settings, path: "/dashboard/settings" },
      { title: "Reports", icon: Axis3D, path: "/dashboard/report" },
    ]
  } else if (userRole === "super_admin") {
    navItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { title: "Approve Hostel", icon: CheckSquare, path: "/dashboard/approve-hostel" },
      { title: "Transactions", icon: Wallet2, path: "/dashboard/transactions" },
      { title: "Users", icon: UserCog, path: "/dashboard/users" },
      { title: "Hostel Management", icon: Hotel, path: "/dashboard/hostel-management" },
      { title: "Reports", icon: Axis3D, path: "/dashboard/report" },
    ]
  } else if (userRole === "resident") {
    navItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { title: "My Room", icon: House, path: "/dashboard/view-room-details" },
      { title: "Requests", icon: GitPullRequest, path: "/dashboard/make-request" },
      { title: "Billing", icon: HandCoins, path: "/dashboard/payment-billing" },
      { title: "Announcements", icon: Megaphone, path: "/dashboard/view-announcements" },
      { title: "Documents", icon: BookOpenCheck, path: "/dashboard/documents" },
      { title: "Feedback", icon: Megaphone, path: "/dashboard/feedback" },
    ]
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-3">
      {/* Navigation Items */}
      <SidebarMenu className="gap-1.5">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              onClick={() => navigate(item.path)}
              tooltip={item.title}
              isActive={pathname === item.path}
              className={cn(
                "w-full rounded-xl transition-all duration-200 py-3 px-4 h-auto",
                "hover:!bg-forest-green-100 hover:!shadow-sm hover:!text-forest-green-700",
                "dark:hover:!bg-forest-green-900 dark:hover:!text-forest-green-100",
                "data-[active=true]:!bg-forest-green-300 data-[active=true]:!text-forest-green-800 data-[active=true]:!shadow-sm",
                "dark:data-[active=true]:!bg-forest-green-700 dark:data-[active=true]:!text-forest-green-100"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="font-medium text-sm">
                {item.title}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  )
}

export default NavMain
