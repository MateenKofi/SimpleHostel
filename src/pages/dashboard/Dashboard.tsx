import Admin from "@/components/dashboard/Admin";
import SuperAdmin from "@/components/dashboard/SuperAdmin";
import SEOHelmet from "@/components/SEOHelmet";
import { useAuthStore } from "@/stores/useAuthStore";
import Resident from "@/components/dashboard/Resident";
import { PageHeader } from "@/components/layout/PageHeader";
import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuthStore();
  const isResident = user?.role === 'resident';

  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <SEOHelmet
        title="Dashboard - Fuse"
        description="Manage your account and settings on Fuse."
        keywords="dashboard, Fuse, user account"
      />
      {/* Show header only for non-resident users (resident has its own in-component header) */}
      {!isResident && (
        <PageHeader
          title={`Welcome, ${user?.name || 'Guest'}`}
          subtitle="This is your dashboard where you can manage your account and settings"
          icon={LayoutDashboard}
          sticky={false}
        />
      )}
      <div>
        {user && user.role === 'super_admin' && <SuperAdmin />}
        {user && user.role === 'admin' && <Admin />}
        {user && user.role === 'resident' && <Resident />}
      </div>
    </main>
  )
}

export default Dashboard;
