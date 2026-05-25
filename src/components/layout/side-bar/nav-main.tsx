"use client"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  RefreshCw,
  ChevronRight,
} from "lucide-react"
import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  icon: React.ComponentType<LucideProps>
  path: string
}

type NavGroup = {
  title: string
  items: NavItem[]
}

export function NavMain() {
  const userRole = localStorage.getItem("role")
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { state } = useSidebar()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const isSidebarCollapsed = state === "collapsed"

  let navGroups: NavGroup[] = []

  if (userRole === "admin") {
    navGroups = [
      {
        title: "Overview",
        items: [
          { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
          { title: "Reports", icon: Axis3D, path: "/dashboard/report" },
        ],
      },
      {
        title: "Hostel Operations",
        items: [
          { title: "Calendar Year", icon: Calendar, path: "/dashboard/calendar-year-management" },
          { title: "Room Management", icon: BedDouble, path: "/dashboard/room-management" },
          { title: "Residents", icon: BookOpenCheck, path: "/dashboard/resident-management" },
          { title: "Debtors List", icon: AlertCircle, path: "/dashboard/deptors-list" },
        ],
      },
      {
        title: "Engagement",
        items: [
          { title: "Maintenance", icon: Wrench, path: "/dashboard/maintenance" },
          { title: "Announcements", icon: Megaphone, path: "/dashboard/announcement-dashboard" },
          { title: "Visitors", icon: CalendarCheck, path: "/dashboard/visitor-management" },
        ],
      },
      {
        title: "Finance",
        items: [
          { title: "Transactions", icon: Wallet2, path: "/dashboard/transactions" },
          { title: "Refunds", icon: RefreshCw, path: "/dashboard/refunds" },
          { title: "Disbursements", icon: HandCoins, path: "/dashboard/disbursements" },
        ],
      },
      {
        title: "Administration",
        items: [
          { title: "Staff", icon: Users, path: "/dashboard/staff-management" },
          { title: "Settings", icon: Settings, path: "/dashboard/settings" },
          { title: "Permissions", icon: Shield, path: "/dashboard/permissions" },
        ],
      },
    ]
  } else if (userRole === "super_admin") {
    navGroups = [
      {
        title: "Overview",
        items: [
          { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
          { title: "Reports", icon: Axis3D, path: "/dashboard/report" },
        ],
      },
      {
        title: "Platform",
        items: [
          { title: "Approve Hostel", icon: CheckSquare, path: "/dashboard/approve-hostel" },
          { title: "Hostel Management", icon: Hotel, path: "/dashboard/hostel-management" },
          { title: "Users", icon: UserCog, path: "/dashboard/users" },
        ],
      },
      {
        title: "Finance",
        items: [
          { title: "Transactions", icon: Wallet2, path: "/dashboard/transactions" },
          { title: "Refunds", icon: RefreshCw, path: "/dashboard/refunds" },
          { title: "Disbursements", icon: HandCoins, path: "/dashboard/disbursement-management" },
        ],
      },
      {
        title: "Administration",
        items: [
          { title: "Permissions", icon: Shield, path: "/dashboard/permissions" },
        ],
      },
    ]
  } else if (userRole === "resident") {
    navGroups = [
      {
        title: "Overview",
        items: [{ title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
      },
      {
        title: "Housing",
        items: [
          { title: "Find a Room", icon: BedDouble, path: "/find-hostel" },
          { title: "My Room", icon: House, path: "/dashboard/view-room-details" },
        ],
      },
      {
        title: "Resident Services",
        items: [
          { title: "Requests", icon: GitPullRequest, path: "/dashboard/make-request" },
          { title: "Billing", icon: HandCoins, path: "/dashboard/payment-billing" },
          { title: "Documents", icon: BookOpenCheck, path: "/dashboard/documents" },
        ],
      },
      {
        title: "Communication",
        items: [
          { title: "Announcements", icon: Megaphone, path: "/dashboard/view-announcements" },
          { title: "Feedback", icon: Megaphone, path: "/dashboard/feedback" },
        ],
      },
    ]
  } else if (userRole === "staff") {
    navGroups = [
      {
        title: "Overview",
        items: [{ title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
      },
      {
        title: "Operations",
        items: [
          { title: "Residents", icon: BookOpenCheck, path: "/dashboard/resident-management" },
          { title: "Maintenance", icon: Wrench, path: "/dashboard/maintenance" },
          { title: "Visitors", icon: CalendarCheck, path: "/dashboard/visitor-management" },
        ],
      },
      {
        title: "Engagement",
        items: [{ title: "Announcements", icon: Megaphone, path: "/dashboard/announcement-dashboard" }],
      },
      {
        title: "Finance",
        items: [{ title: "Transactions", icon: Wallet2, path: "/dashboard/transactions" }],
      },
    ]
  }

  return (
    <div className="flex flex-col gap-1 px-2 py-2">
      {navGroups.map((group) => {
        const isGroupOpen = isSidebarCollapsed ? true : openGroups[group.title] ?? true
        const isGroupActive = group.items.some((item) =>
          pathname === item.path ||
          (item.path !== "/dashboard" && pathname.startsWith(`${item.path}/`))
        )

        return (
        <Collapsible
          key={group.title}
          open={isGroupOpen}
          onOpenChange={(open) => {
            setOpenGroups((current) => ({
              ...current,
              [group.title]: open,
            }))
          }}
        >
          <SidebarGroup className="px-1 py-1.5">
            <CollapsibleTrigger
              className={cn(
                "group/category relative flex w-full items-center justify-between overflow-hidden rounded-lg px-3 py-2 text-left",
                "text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground/80",
                "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                "hover:bg-forest-green-50/70 hover:text-forest-green-800 hover:shadow-sm",
                "data-[state=open]:bg-muted/60 data-[state=open]:text-foreground",
                "after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-left after:scale-x-0",
                "after:bg-gradient-to-r after:from-primary/70 after:via-forest-green-300 after:to-transparent",
                "after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] after:motion-reduce:transition-none",
                "hover:after:scale-x-100 data-[state=open]:after:scale-x-100 group-data-[collapsible=icon]:hidden",
                isGroupActive && "bg-forest-green-50 text-forest-green-800 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.12)] after:scale-x-100"
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30 transition-all duration-300",
                    "motion-safe:group-hover/category:scale-125 motion-safe:group-hover/category:bg-primary/70",
                    isGroupActive && "bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.12)] motion-safe:animate-pulse"
                  )}
                />
                <span className="truncate">{group.title}</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-data-[state=open]/category:rotate-90 group-hover/category:text-primary" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.path ||
                      (item.path !== "/dashboard" && pathname.startsWith(`${item.path}/`))

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
                          tooltip={item.title}
                          isActive={isActive}
                          className={cn(
                            "group/nav relative h-10 w-full rounded-lg px-3 py-2 transition-all duration-200",
                            "hover:!bg-forest-green-50 hover:!text-forest-green-800 hover:!shadow-sm",
                            "dark:hover:!bg-forest-green-900 dark:hover:!text-forest-green-100",
                            "data-[active=true]:!bg-forest-green-100 data-[active=true]:!text-forest-green-900 data-[active=true]:!shadow-sm",
                            "dark:data-[active=true]:!bg-forest-green-800 dark:data-[active=true]:!text-forest-green-50",
                            "before:absolute before:left-0 before:top-2 before:h-6 before:w-1 before:rounded-r-full before:bg-transparent before:transition-colors",
                            "data-[active=true]:before:bg-primary"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
                              "bg-muted/60 text-muted-foreground group-hover/nav:bg-forest-green-100 group-hover/nav:text-forest-green-700",
                              "group-data-[active=true]/nav:bg-primary group-data-[active=true]/nav:text-primary-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                          </span>
                          <span className="font-medium text-sm">{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      )})}
    </div>
  )
}

export default NavMain
