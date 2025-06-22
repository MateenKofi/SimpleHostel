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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CustomeRefetch from "../CustomeRefetch";

const Layout = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  
  useEffect(() => {
    if (!token || token === "undefined") {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const {
    data: user,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["changePassword"],
    queryFn: async () => {
      const res = await axios.get(`/api/users/get/${userId}`);
      return res.data;
    },
    enabled: !!token, // only fetch user if token exists
  });

 useEffect(() => {
    if (user && user.changedPassword === false) {
      navigate("/change-password");
    }
  }, [user, navigate]);
  // ⏳ Show a loading state while everything loads
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  if(isError){
    return <CustomeRefetch refetch={refetch}/>
  }

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
