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
import { useUserStore } from "@/controllers/UserStore";

const Layout = () => {
  const navigate = useNavigate();
const logout = useUserStore((state) => state.logout)
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!token || token === "undefined") {
      setTimeout(() => {
        logout();
      },50)
      navigate("/login", { replace: true });
    }
  }, [token, navigate, logout]);

  
  const userInfo = JSON.parse(localStorage.getItem("user-store")
   || "{}");
   const user = userInfo?.user?.changedPassword

 useEffect(() => {
    if (user && user.changedPassword === false) {
      navigate("/change-password");
    }
  }, [user, navigate]);
 
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-[100dvh] bg-gray-200 overflow-scroll">
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
