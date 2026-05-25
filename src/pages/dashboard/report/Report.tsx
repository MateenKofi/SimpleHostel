import AdminReport from "@/components/report/AdminReport";
import SuperAdminReport from "@/components/report/SuperAdminReport";
import SEOHelmet from "@/components/SEOHelmet";
import { Can } from "@/components/auth/Can";
import { useAuthStore } from "@/stores/useAuthStore";
import { can } from "@/lib/permissions";

const Report = () => {
  const permissions = useAuthStore((state) => state.permissions);
  const role = useAuthStore((state) => state.role);

  const isSuperAdmin = role === "super_admin" || can(permissions, "reports.view_all");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHelmet
        title="Report - Fuse"
        description="Generate and view reports on hostel activities."
        keywords="Report, hostel, Fuse"
      />
      <main className="flex-1 p-3 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {isSuperAdmin ? (
            <SuperAdminReport />
          ) : (
            <Can permission="reports.view">
              <AdminReport />
            </Can>
          )}
        </div>
      </main>
    </div>
  );
};

export default Report;
