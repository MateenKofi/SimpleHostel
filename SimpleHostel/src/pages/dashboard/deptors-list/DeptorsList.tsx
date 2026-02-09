import React from "react";
import DebtorListTable from "./DeptorListTable";
import { Users } from "lucide-react";
import SEOHelmet from "@/components/SEOHelmet";

const DeptorsList = () => {
  return (
    <div className="p-6">
      <SEOHelmet
        title="Debtors List - Fuse"
        description="Manage your hostel debtors efficiently with our user-friendly interface."
        keywords="debtors list, hostel, Fuse"
        />
      <div className="flex justify-between items-center mb-6 border border-border bg-card p-2 rounded-md shadow-md">
        <div className="flex flex-col gap-2">
          <span className="flex gap-1">
            <Users className="w-6 h-6" />
            <h1 className="text-2xl font-bold text-foreground">Debtors</h1>
          </span>
          <p className="text-muted-foreground text-xs">
            Manage all hostel debtors here. Make payments, and view debtor details.
          </p>
        </div>
      </div>
      <div className="border border-border shadow-md rounded-lg bg-card mb-3 p-4">
        <DebtorListTable />
      </div>
    </div>
  );
};

export default DeptorsList;
