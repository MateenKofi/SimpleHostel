import SEOHelmet from "@/components/SEOHelmet";
import AdminTransactions from "@/components/transactions/AdminTransactions";
import SuperAdminTransaction from "@/components/transactions/SuperAdminTransaction";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgeCent } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

const Transactions = () => {
  const role = useAuthStore((state) => state.role);
  const isSuperAdmin = role === "super_admin";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Fuse - Transactions"
        description="Transactions page of Fuse"
        keywords="Fuse, transactions, dashboard"
      />
      <PageHeader
        title="Transactions"
        subtitle="View and manage all payment transactions"
        icon={BadgeCent}
        sticky={true}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Super admin sees system-wide transaction overview */}
          {isSuperAdmin ? (
            <SuperAdminTransaction />
          ) : (
            /* Admin and staff see their hostel's transactions */
            <AdminTransactions />
          )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
