import {useEffect} from 'react'
import { Outlet } from 'react-router-dom';
import { AppSidebar } from "./side-bar/App-Sidebar"
import {useNavigate} from 'react-router-dom'
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const Layout = () => {
const navigate = useNavigate()
  useEffect(() => {
    if(localStorage.getItem('token') === null){
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
      navigate('/login')
    }
  }, [])
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 border-b-2 border-gray-200 w-full h-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 " />
  
          </div>
        </header>
       <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout; 