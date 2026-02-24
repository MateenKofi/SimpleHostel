import AdminReport from "@/components/report/AdminReport";
import SuperAdminReport from "@/components/report/SuperAdminReport";
import SEOHelmet from "@/components/SEOHelmet";
import { useAuthStore } from "@/stores/useAuthStore";

const Report = () => {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHelmet
        title="Report - Fuse"
        description="Generate and view reports on hostel activities."
        keywords="Report, hostel, Fuse"
      />
      <main className="flex-1 p-3 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {user && user.role === 'super_admin' && <SuperAdminReport />}
          {user && user.role === 'admin' && <AdminReport />}
        </div>
      </main>
    </div>
  );
};

export default Report;
