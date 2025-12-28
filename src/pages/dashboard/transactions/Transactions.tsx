import SEOHelmet from "@/components/SEOHelmet";
import AdminTransactions from "@/components/transactions/AdminTransactions";
import SuperAdminTransaction from "@/components/transactions/SuperAdminTransaction";
import { useUserStore } from "@/controllers/UserStore";

const Transactions = () => {
 const { user } = useUserStore();
  return (
    <div className="p-6">
     <SEOHelmet
        title="Fuse - Transactions"
        description="Transactions page of Fuse"
        keywords="Fuse, transactions, dashboard"
     />
     {user && user.role === 'super_admin' && <SuperAdminTransaction/>}
     {user && user.role === 'ADMIN' && <AdminTransactions/>}
    </div>
  );
};

export default Transactions;
