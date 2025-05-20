import Admin from "@/components/dashboard/Admin";
import SuperAdmin from "@/components/dashboard/SuperAdmin";
import SEOHelmet from "@/components/SEOHelmet";
import { useUserStore } from "@/controllers/UserStore";

const Dashboard = () => {
  const { user } = useUserStore();

  return (
    <main className="flex-1 bg-white overflow-y-auto p-4">
      <SEOHelmet
        title="Dashboard - Fuse"
        description="Manage your account and settings on Fuse."
        keywords="dashboard, Fuse, user account"
      />
      <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Guest'}</h1>
      <p className="mt-2 text-gray-600">
        This is your dashboard where you can manage your account and settings.
      </p>
      <div>
      {user && user.role === 'SUPER_ADMIN' && <SuperAdmin />}
      {user && user.role === 'ADMIN' && <Admin />}
      </div>
    </main>
  )
}

export default Dashboard;