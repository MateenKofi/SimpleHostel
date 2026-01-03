import AdminReport from "@/components/report/AdminReport";
import SuperAdminReport from "@/components/report/SuperAdminReport";
import SEOHelmet from "@/components/SEOHelmet";
import { useAuthStore } from "@/stores/useAuthStore";

const Report = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <SEOHelmet
        title="Report - Fuse"
        description="Generate and view reports on hostel activities."
        keywords="Report, hostel, Fuse"
      />
      <div>
        {user && user.role === 'super_admin' && <SuperAdminReport />}
        {user && user.role === 'ADMIN' && <AdminReport />}
      </div>
    </div>
  );
};

export default Report;
