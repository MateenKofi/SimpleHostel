import { useNavigate } from "react-router-dom"
import HostelManagementTable from "@/components/HostelManagementTable"
import { HostelMap } from "@/components/maps/HostelMap"
import SEOHelmet from "@/components/SEOHelmet"
import { PageHeader } from "@/components/layout/PageHeader"
import { Building2, Loader2, Maximize2 } from "lucide-react"
import { getHostels } from "@/api/hostels"
import { useQuery } from "@tanstack/react-query"

const HostelManagement = () => {
  const navigate = useNavigate()

  const { data: hostelResponse, isLoading } = useQuery({
    queryKey: ["hostels-for-management"],
    queryFn: () => getHostels(),
  })

  const hostels = hostelResponse?.data || []

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Hostel Management - Fuse"
        description="Manage your hostel efficiently with our user-friendly interface."
        keywords="hostel management, hostel, Fuse"
      />
      <PageHeader
        title="Hostel Management"
        subtitle="Manage and configure hostel properties"
        icon={Building2}
        sticky={true}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {isLoading ? (
            <div className="h-[420px] flex items-center justify-center bg-muted rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => navigate("/map")}
                className="absolute top-3 right-3 z-10 p-2 bg-card rounded-lg shadow-md border hover:bg-muted transition-colors"
                title="View fullscreen map"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <HostelMap 
                hostels={hostels} 
                height="420px"
              />
            </div>
          )}
          <HostelManagementTable />
        </div>
      </main>
    </div>
  )
}

export default HostelManagement