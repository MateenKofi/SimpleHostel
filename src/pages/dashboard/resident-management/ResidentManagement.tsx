import React from "react";
import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResidentTable from "@/components/resident/ResidentTable";

const ResidentManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 border p-2 rounded-md shadow-md">
        <div className="flex flex-col gap-2">
          <span className="flex gap-1">
            <Users className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Resident Management</h1>
          </span>
          <p className=" text-gray-400 text-xs">
            Manage all hostel residents here. Add new residents, verify room
            assignments, and view resident details.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/room-verification")}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Verify Resident
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2"
            onClick={()=> navigate("/dashboard/resident-management/add-resident")}
          >
            <Plus className="w-4 h-4" />
            <span>Resident</span>
          </button>
        </div>
      </div>
     <div className="p-4 border rounded-md shadow-md">
       <p className="text-gray-500 text-sm mb-2">
        All residents are listed below. You can edit or delete them as needed.
      </p>
      <ResidentTable />
     </div>
    </div>
  );
};

export default ResidentManagement;
