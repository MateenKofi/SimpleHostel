import AdminReport from "@/components/report/AdminReport";
import SuperAdminReport from "@/components/report/SuperAdminReport";
import SEOHelmet from "@/components/SEOHelmet";
import { useAuthStore } from "@/stores/useAuthStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { BarChart3 } from "lucide-react";

const Report = () => {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Report - Fuse"
        description="Generate and view reports on hostel activities."
        keywords="Report, hostel, Fuse"
      />
      <PageHeader
        title="Reports"
        subtitle="Generate and view analytical reports on hostel activities"
        icon={BarChart3}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {user && user.role === 'super_admin' && <SuperAdminReport />}
          {user && user.role === 'ADMIN' && <AdminReport />}
        </div>
      </main>
    </div>
  );
};

export default Report;
