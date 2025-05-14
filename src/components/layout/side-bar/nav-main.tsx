"use client";
import { useNavigate } from "react-router-dom";
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
  List,
  CalendarCheck,
  Wrench,
  Users,
  CheckSquare,
  Calendar,
  UserCog,
  Wallet2,
  LucideProps,
  LogOut,
  Layout,
  Hotel,
  Settings
} from "lucide-react";
import { useUserStore } from "@/controllers/UserStore";

type navItems = {
  title: string;
  icon: React.ComponentType<LucideProps>;
  path: string;
};
export function NavMain() {
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);

  let navItems: navItems[] = [];

  if (userRole === "ADMIN") {
    navItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      {
        title: "Calendar Year",
        icon: Calendar,
        path: "/dashboard/calendar-year-management",
      },
      {
        title: "Room Management",
        icon: BedDouble,
        path: "/dashboard/room-management",
      },
      {
        title: "Resident Management",
        icon: BookOpenCheck,
        path: "/dashboard/resident-management",
      },
      { title: "Debtors List", icon: List, path: "/dashboard/deptors-list" },
      {
        title: "Visitor Management",
        icon: CalendarCheck,
        path: "/dashboard/visitor-management",
      },
      {
        title: "Maintenance & Tracking",
        icon: Wrench,
        path: "/dashboard/maintenance-and-tracking",
      },
      {
        title: "Staff Management",
        icon: Users,
        path: "/dashboard/staff-management",
      },
      { title: "Transactions", icon: Wallet2, path: "/dashboard/transactions" },
      { title:"Settings", icon:Settings, path:'/dashboard/settings'}
    ];
  } else if (userRole === "SUPER_ADMIN") {
    navItems = [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      {
        title: "Approve Hostel",
        icon: CheckSquare,
        path: "/dashboard/approve-hostel",
      },
      { title: "Transactions", icon: Wallet2, path: "/dashboard/transactions" },
      { title: "Users", icon: UserCog, path: "/dashboard/users" },
      { title: "Hostel Management", icon: Hotel, path: '/dashboard/hostel-management' },
    ];
  }

  return (
    <div className="overflow-x-hidden">
     <SidebarGroup className="m-0 p-0 ">
        <SidebarMenuButton
          onClick={() => navigate("/")}
          tooltip="landing page"
          className="w-full transition-all duration-500 ease-in-out hover:bg-black hover:text-white hover:translate-x-2 rounded-md"
        >
          <Layout className="w-4 h-4" />
          <span>Home</span>  
        </SidebarMenuButton>
      </SidebarGroup>
      <SidebarGroup className="m-0 p-0 ">
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                tooltip={item.title}
                className="w-full transition-all duration-500 ease-in-out hover:bg-black hover:text-white hover:translate-x-1 rounded-md"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <div className="mx-auto w-4/5 bg-black border border-gray-300 my-3"></div>
      <SidebarGroup className="m-0 p-0 ">
        <SidebarMenuButton
          onClick={() => logout()}
          tooltip="Log Out"
          className="w-full transition-all duration-500 ease-in-out hover:bg-black hover:text-white hover:translate-x-2 rounded-md"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>  
        </SidebarMenuButton>
      </SidebarGroup>
    </div>
  );
}
export default NavMain;