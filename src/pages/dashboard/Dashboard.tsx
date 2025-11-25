import Admin from "@/components/dashboard/Admin";
import SuperAdmin from "@/components/dashboard/SuperAdmin";
import SEOHelmet from "@/components/SEOHelmet";
import { useUserStore } from "@/controllers/UserStore";

const Dashboard = () => {
  const { user } = useUserStore();
  console.log(user)

  return (
    <main className="flex-1 p-4 overflow-y-auto bg-white">
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
      {user && user.role === 'super_admin' && <SuperAdmin />}
      {user && user.role === 'admin' && <Admin />}
      </div>
    </main>
  )
}

export default Dashboard;