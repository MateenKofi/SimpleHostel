import React from "react";
import DebtorListTable from "./DeptorListTable";
import { Users } from "lucide-react";
import SEOHelmet from "@/components/SEOHelmet";
import { PageHeader } from "@/components/layout/PageHeader";

const DeptorsList = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Debtors List - Fuse"
        description="Manage your hostel debtors efficiently with our user-friendly interface."
        keywords="debtors list, hostel, Fuse"
      />
      <PageHeader
        title="Debtors"
        subtitle="Manage all hostel debtors here. Make payments, and view debtor details."
        icon={Users}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="border border-border shadow-sm rounded-lg bg-card p-4">
            <DebtorListTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeptorsList;
