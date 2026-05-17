import AdminReport from "@/components/report/AdminReport";
import SuperAdminReport from "@/components/report/SuperAdminReport";
import SEOHelmet from "@/components/SEOHelmet";
import { Can } from "@/components/auth/Can";

const Report = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHelmet
        title="Report - Fuse"
        description="Generate and view reports on hostel activities."
        keywords="Report, hostel, Fuse"
      />
      <main className="flex-1 p-3 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Super admin report spans all hostels */}
          <Can permission="reports.view_all">
            <SuperAdminReport />
          </Can>
          {/* Admin report is scoped to their hostel */}
          <Can permission="reports.view">
            <AdminReport />
          </Can>
        </div>
      </main>
    </div>
  );
};

export default Report;
