import Admin from "@/components/dashboard/Admin";
import SuperAdmin from "@/components/dashboard/SuperAdmin";
import Staff from "@/components/dashboard/Staff";
import SEOHelmet from "@/components/SEOHelmet";
import { useAuthStore } from "@/stores/useAuthStore";
import Resident from "@/components/dashboard/Resident";
import { PageHeader } from "@/components/layout/PageHeader";
import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuthStore();
  const isResident = user?.role === 'resident';
  const isStaff = user?.role === 'staff';

  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <SEOHelmet
        title="Dashboard - Best Suit"
        description="Manage your account and settings on Best Suit."
        keywords="dashboard, Best Suit, user account"
      />
      {/* Show header only for non-resident users (resident has its own in-component header) */}
      {!isResident && (
        <PageHeader
          title={`Welcome, ${user?.name || 'Guest'}`}
          subtitle="This is your dashboard where you can manage your account and settings"
          icon={LayoutDashboard}
          sticky={true}
          backgroundImage="https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&w=1200&q=80"
        />
      )}
      <div>
        {user && user.role === 'super_admin' && <SuperAdmin />}
        {user && user.role === 'admin' && <Admin />}
        {user && user.role === 'staff' && <Staff />}
        {user && user.role === 'resident' && <Resident />}
      </div>
    </main>
  )
}

export default Dashboard;
