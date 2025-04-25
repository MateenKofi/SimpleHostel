import React from "react";
import AddResidentModal from "../../../components/resident/AddResidentModal";
import {  Plus,  Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "@components/Modal";
import ResidentTable from "@/components/resident/ResidentTable";

const ResidentManagement = () => {
  const navigate = useNavigate();
  const { open: openAddResidentModal, close: closeAddResidentModal } = useModal("add_resident_modal");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Resident Management</h1>
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
            onClick={openAddResidentModal}
          >
            <Plus className="w-4 h-4" />
            <span>Resident</span>
          </button>
        </div>
      </div>
      <ResidentTable/>
      <AddResidentModal onClose={closeAddResidentModal} />
    </div>
  );
};

export default ResidentManagement;