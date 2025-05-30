import { Outlet } from "react-router-dom";
import { AppSidebar } from "./side-bar/App-Sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ErrorBoundary from "../ErrorBoundary";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token || token === "undefined") {
        navigate("/login");
      }
    }, [navigate]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-[100dvh] bg-gray-200 overflow-scroll">
        <SidebarInset>
          <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 border-b-2 border-gray-200 w-full h-full">
              <SidebarTrigger className="-ml-1"/>
              <Separator orientation="vertical" className="mr-2 h-4 " />
            </div>
          </header>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
