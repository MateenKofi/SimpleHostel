import React from "react";
import DebtorListTable from "./DeptorListTable";
import { Users } from "lucide-react";

const DeptorsList = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 border p-2 rounded-md shadow-md">
        <div className="flex flex-col gap-2">
          <span className="flex gap-1">
            <Users className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Deptors</h1>
          </span>
          <p className=" text-gray-400 text-xs">
            Manage all hostel deptors here. Make payments, and view deptor details.
          </p>
        </div>
      </div>
      <div className=" border shadow-md rounded-lg bg-white mb-3 p-4">
        <DebtorListTable />
      </div>
    </div>
  );
};

export default DeptorsList;
