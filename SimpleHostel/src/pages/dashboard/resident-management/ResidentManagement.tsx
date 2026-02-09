import { Plus, Users, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResidentTable from "@/components/resident/ResidentTable";
import SEOHelmet from "@/components/SEOHelmet";
import { toast } from "sonner";

const ResidentManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <SEOHelmet
        title="Resident Management - Fuse"
        description="Manage your hostel residents efficiently with our user-friendly interface."
        keywords="resident management, hostel, Fuse"
      />
      <div className="flex justify-between items-center mb-6 border border-border p-2 rounded-md shadow-md ">
        <div className="flex flex-col gap-2">
          <span className="flex gap-1">
            <Users className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Resident Management</h1>
          </span>
          <p className=" text-muted-foreground text-xs">
            Manage all hostel residents here. Add new residents, verify room
            assignments, and view resident details.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const hostelId = localStorage.getItem("hostelId")
              if (hostelId) window.open(`/api/exports/residents/${hostelId}`, '_blank')
              else toast.error("Hostel ID not found")
            }}
            className="px-4 py-2 border border-input text-foreground bg-background rounded-md hover:bg-muted flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => navigate("/dashboard/resident-lookup")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Verify Resident
          </button>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center gap-2"
            onClick={() => navigate("/dashboard/resident-management/add-resident")}
          >
            <Plus className="w-4 h-4" />
            <span>Resident</span>
          </button>
        </div>
      </div>
      <div className="p-4 border border-border rounded-md shadow-md">
        <p className="text-muted-foreground text-sm mb-2">
          All residents are listed below. You can edit or delete them as needed.
        </p>
        <ResidentTable />
      </div>
    </div>
  );
};

export default ResidentManagement;
