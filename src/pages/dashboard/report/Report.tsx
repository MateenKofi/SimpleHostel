import AdminReport from "@/components/report/AdminReport";
import SuperAdminReport from "@/components/report/SuperAdminReport";
import SEOHelmet from "@/components/SEOHelmet";
import { useUserStore } from "@/controllers/UserStore";

const Report = () => {
    const { user } = useUserStore();
  return (
    <div>
      <SEOHelmet
        title="Report - Fuse"
        description="Generate and view reports on hostel activities."
        keywords="Report, hostel, Fuse"
      />
      <div>
            {user && user.role === 'super_admin' && <SuperAdminReport />}
            {user && user.role === 'ADMIN' && <AdminReport/>}
            </div>
    </div>
  );
};

export default Report;
