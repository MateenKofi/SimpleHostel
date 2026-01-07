"use client";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
  LogOut,
  Layout,
  Hotel,
  Settings,
  LucideProps,
  Axis3D,
  House,
  GitPullRequest,
  HandCoins,
  HandPlatter,
  Megaphone,
  Wrench
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

type navItems = {
  title: string;
  icon: React.ComponentType<LucideProps>;
  path: string;
  description?: string;
};

export function NavMain() {
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logout = useAuthStore((state) => state.logout);

  let navItems: navItems[] = [];

  if (userRole === "admin") {
    navItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", description: "Overview of hostel management" },
      { title: "Calendar Year", icon: Calendar, path: "/dashboard/calendar-year-management", description: "Manage calendar years and academic sessions" },
      { title: "Room Management", icon: BedDouble, path: "/dashboard/room-management", description: "Manage rooms, blocks, and floors" },
      { title: "Maintenance Requests", icon: Wrench, path: "/dashboard/maintenance", description: "Manage maintenance issues" },
      { title: "Announcements", icon: Megaphone, path: "/dashboard/announcement-dashboard", description: "Manage announcements" },
      { title: "Resident Management", icon: BookOpenCheck, path: "/dashboard/resident-management", description: "Manage residents, payments, and assignments" },
      { title: "Visitor Management", icon: CalendarCheck, path: "/dashboard/visitor-management", description: "Manage visitor records and approvals" },
      { title: "Staff Management", icon: Users, path: "/dashboard/staff-management", description: "Manage staff members and their roles" },
      { title: "Transactions", icon: Wallet2, path: "/dashboard/transactions", description: "View and manage financial transactions" },
      { title: "Hostel Settings", icon: Settings, path: '/dashboard/settings', description: "Manage hostel settings and configurations" },
      { title: "Report", icon: Axis3D, path: '/dashboard/report', description: "Generate and view reports on hostel activities" },
    ];
  } else if (userRole === "super_admin") {
    navItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", description: "Overview of hostel management" },
      { title: "Approve Hostel", icon: CheckSquare, path: "/dashboard/approve-hostel", description: "Approve or reject hostel applications" },
      { title: "Transactions", icon: Wallet2, path: "/dashboard/transactions", description: "View and manage financial transactions" },
      { title: "Users", icon: UserCog, path: "/dashboard/users", description: "Manage users and their roles" },
      { title: "Hostel Management", icon: Hotel, path: '/dashboard/hostel-management', description: "Manage hostel facilities and services" },
      { title: "Report", icon: Axis3D, path: '/dashboard/report', description: "Generate and view reports on hostel activities" },
    ];
  } else if (userRole === 'resident') {
    navItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", description: "Overview of hostel management" },
      { title: "View Room Details", icon: House, path: "/dashboard/view-room-details", description: "View room details" },
      { title: "Make Request", icon: GitPullRequest, path: "/dashboard/make-request", description: "Make a request" },
      { title: "Payment & Billing", icon: HandCoins, path: "/dashboard/payment-billing", description: "Make a payment" },
      { title: "View Announcements", icon: Megaphone, path: "/dashboard/view-announcements", description: "View announcements" },
      { title: "Documents", icon: BookOpenCheck, path: "/dashboard/documents", description: "Allocation letters & rules" },
      { title: "Feedback", icon: Megaphone, path: "/dashboard/feedback", description: "Rate services" },
    ];
  }

  return (
    <div className="overflow-x-hidden">
      <SidebarGroup className="p-0 m-0 ">
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuButton
            onClick={() => navigate("/")}
            tooltip="landing page"
            className={`w-full transition-all duration-500 ease-in-out rounded-md hover:bg-destructive hover:text-destructive-foreground hover:translate-x-2 ${pathname === "/" ? "bg-destructive text-destructive-foreground" : ""}`}
          >
            <Layout className="w-4 h-4" />
            <span>Home</span>
          </SidebarMenuButton>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                tooltip={item.title}
                className={`flex items-center w-full gap-2 ml-3 transition-all duration-500 ease-in-out rounded-md h-fit hover:shadow-lg hover:bg-destructive hover:text-destructive-foreground hover:translate-x-1 ${pathname === item.path ? "bg-white shadow-sm border-l-4 border-destructive" : ""}`}
              >
                {item.icon && <item.icon className="w-8 h-8" />}
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  {item.description && (
                    <span className="text-[10px] text-gray-500">{item.description}</span>
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <div className="w-4/5 mx-auto my-3 bg-black border border-gray-300"></div>
      <SidebarGroup className="p-0 m-0 ">
        <SidebarMenuButton
          onClick={() => logout()}
          tooltip="Log Out"
          className="w-full transition-all duration-500 ease-in-out rounded-md hover:bg-destructive hover:text-destructive-foreground hover:translate-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SidebarGroup>
    </div>
  );
}

export default NavMain;

