import { Plus, Users, Download, DownloadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResidentTable from "@/components/resident/ResidentTable";
import SEOHelmet from "@/components/SEOHelmet";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

const ResidentManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Resident Management - Fuse"
        description="Manage your hostel residents efficiently with our user-friendly interface."
        keywords="resident management, hostel, Fuse"
      />
      <PageHeader
        title="Resident Management"
        subtitle="Manage all hostel residents here. Add new residents, verify room assignments, and view resident details."
        icon={Users}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const hostelId = localStorage.getItem("hostelId")
                if (hostelId) window.open(`/api/exports/residents/${hostelId}`, '_blank')
                else toast.error("Hostel ID not found")
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/resident-lookup")}
            >
              Verify Resident
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/dashboard/resident-management/add-resident")}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Resident</span>
            </Button>
          </div>
        }
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <ResidentTable />
        </div>
      </main>
    </div>
  );
};

export default ResidentManagement;
