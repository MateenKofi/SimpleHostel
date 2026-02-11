import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./side-bar/App-Sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ErrorBoundary from "../ErrorBoundary";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const Layout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || token === "undefined") {
      setTimeout(() => {
        logout();
      }, 10);
      window.location.href = "/";
    }
  }, [token, logout]);

  const changedPassword = JSON.parse(
    localStorage.getItem("changedPassword") || "{}"
  );


  useEffect(() => {
    if (changedPassword === false) {
      navigate("/change-password");
    }
  }, [changedPassword, navigate]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full min-h-[100dvh] bg-white overflow-scroll">
        <SidebarInset>
          <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center w-full h-full gap-2 px-4 border-b-2 border-gray-200">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4 mr-2" />
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
