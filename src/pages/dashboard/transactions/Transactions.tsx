import SEOHelmet from "@/components/SEOHelmet";
import AdminTransactions from "@/components/transactions/AdminTransactions";
import SuperAdminTransaction from "@/components/transactions/SuperAdminTransaction";
import { useAuthStore } from "@/stores/useAuthStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgeCent } from "lucide-react";

const Transactions = () => {
  const { user } = useAuthStore();
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
          {user && user.role === 'super_admin' && <SuperAdminTransaction />}
          {user && user.role === 'admin' && <AdminTransactions />}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
