import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Layout from "@components/layout/Layout";
import LandingPageLayout from "./components/layout/LandingPageLayout";
import PrivateRoute from "./components/routes/PrivateRoute";
import ProtectedBookingRoute from "./components/routes/ProtectedBookingRoute";
import RoleRoute from "./components/routes/RoleRoute";
import SEOHelmet from "./components/SEOHelmet";
import { getSeoRoute } from "./config/seo";

// Landing page routes
import Home from './pages/landing-page/page';
import About from './pages/landing-page/About';
import Contact from './pages/landing-page/Contact';
import Services from './pages/landing-page/Services';
import FindHostel from './pages/landing-page/component/findHostel/page';
import FindRoom from './pages/landing-page/component/find-room/Find-Room';
import ResidentForm from './pages/landing-page/component/resident-forms/ResidentForm';
import HostelListingForm from './pages/landing-page/component/hostel-listing/Hostel-Listing-Form';

// Authentication routes
import LoginForm from "./pages/Authentication/login/login-form";
import RegisterForm from "./pages/Authentication/register/register-form";
import ForgetPassword from "./pages/Authentication/forget-password/ForgetPassword";
import ResetPassword from "./pages/Authentication/reset-password/ResetPassword";
import ChangePassword from "./components/changepassword/ChangePassword";

// Dashboard routes
import Dashboard from "@pages/dashboard/Dashboard";
import RoomManagementTab from "@pages/dashboard/room-management/RoomManagementTab";
import RoomAssignmentAndPayment from "@/components/rooms/room-assignment/RoomAssignmentAndPayment";
import ResidentManagement from "@pages/dashboard/resident-management/ResidentManagement";
import VisitorManagement from "@pages/dashboard/visitor-management/VisitorManagement";
import StaffManagement from "@pages/dashboard/staff-management/StaffManagement";
import AddStaff from "@/components/staff/AddStaff";
import EditStaff from "@/components/staff/EditStaff";
import ViewStaff from "@/components/staff/ViewStaff";
import DeptorsList from "./pages/dashboard/deptors-list/DeptorsList";
import ApproveHostel from "./pages/dashboard/approvals/Approve-Hostel";
import ProfileForm from "./pages/dashboard/profile/Profile";
import CalendarYear from "./pages/dashboard/calendarYear/CalendarYear";
import CalendarYearDetail from "./pages/dashboard/calendarYear/CalendarYearDetail";
import Transactions from "./pages/dashboard/transactions/Transactions";
import Users from "./pages/dashboard/users/Users";
import HostelManagement from "./pages/dashboard/hostelManagement/HostelManagement";
import Settings from "./pages/dashboard/settings/Settings";
import ResidentLookup from "./pages/dashboard/resident-management/Resident-lookup";
import EditResident from "./components/resident/EditResident";
import Report from './pages/dashboard/report/Report';
import PermissionsPage from './pages/dashboard/admin/PermissionsPage';
import RefundRequests from "./pages/dashboard/refunds/RefundRequests";

// Component routes
import PaymentSummaryForm from "./components/payment/PaymentSummaryForm";
import TopUpPaymentForm from "./components/payment/TopUpPaymentForm";
import CashPaymentConfirmation from "./components/payment/CashPaymentConfirmation";
import AddResident from "./components/resident/AddResident";
import ViewRoom from "./components/rooms/ViewRoom";
import PaymentSuccess from '@components/payment-success';
import TermsAndCondition from "./components/TermsAndConditions";
import MapPage from "./pages/landing-page/component/map/MapPage";

// Resident portal routes
import ResidentRoomDetails from "./pages/dashboard/resident-management/ResidentRoomDetails";
import ViewResident from "./pages/dashboard/resident-management/ViewResident";
import MakeRequest from "./pages/dashboard/resident-management/MakeRequest";
import PaymentBilling from "./pages/dashboard/resident-management/PaymentBilling";
import Announcements from "./pages/dashboard/resident-management/Announcements";
import Documents from "./pages/dashboard/resident-management/Documents";
import Feedback from "./pages/dashboard/resident-management/Feedback";
import AllocationDetails from "./pages/dashboard/resident-management/AllocationDetails";
import ReceiptPage from "./pages/dashboard/resident-management/ReceiptPage";
import PaymentResult from "./pages/dashboard/payment-result/PaymentResult";

// Admin routes
import AnnouncementDashboard from "./pages/dashboard/admin/AnnouncementDashboard";
import MaintenanceManagement from "./pages/dashboard/admin/MaintenanceManagement";
import DisbursementManagement from "./pages/dashboard/admin/DisbursementManagement";
import AdminDisbursement from "./pages/dashboard/admin/AdminDisbursement";

function RouteSEO() {
  const { pathname } = useLocation();
  const routeSeo = getSeoRoute(pathname);

  return (
    <SEOHelmet
      title={routeSeo?.title}
      description={routeSeo?.description}
      keywords={routeSeo?.keywords}
      canonicalPath={routeSeo?.path || pathname}
    />
  );
}

function App() {
  return (
    <>
      <RouteSEO />
      <Routes>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="hostel-listing" element={<HostelListingForm />} />
        <Route path='terms-and-conditions' element={<TermsAndCondition />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="change-password" element={<ChangePassword />} />

      {/* Protected Booking Routes - Require Authentication */}
      <Route element={<ProtectedBookingRoute />}>
        <Route path="resident-form" element={<ResidentForm />} />
        <Route path="find/:id/room" element={<FindRoom />} />
        <Route path="payment" element={<PaymentSummaryForm />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
        <Route path="payment-cash" element={<CashPaymentConfirmation />} />
      </Route>

      {/* Landing Routes */}
      <Route element={<LandingPageLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="services" element={<Services />} />
        <Route path="find-hostel" element={<FindHostel />} />
        <Route path="map" element={<MapPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Layout />}>

          {/* === Routes accessible by ALL authenticated roles === */}
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfileForm />} />
          <Route path="payment" element={<PaymentSummaryForm />} />
          <Route path="payment-result" element={<PaymentResult />} />
          <Route path="receipt/:reference" element={<ReceiptPage />} />
          <Route path="view-room/:id" element={<ViewRoom />} />

          {/* === Admin + Super Admin only === */}
          <Route element={<RoleRoute allowedRoles={["admin", "super_admin"]} />}>
            <Route path="room-management" element={<RoomManagementTab />} />
            <Route path="calendar-year-management" element={<CalendarYear />} />
            <Route path="calendar-year/:id" element={<CalendarYearDetail />} />
            <Route path="room-assignment" element={<RoomAssignmentAndPayment />} />
            <Route path="resident-management" element={<ResidentManagement />} />
            <Route path="resident-management/add-resident" element={<AddResident />} />
            <Route path="view-resident" element={<ViewResident />} />
            <Route path="deptors-list" element={<DeptorsList />} />
            <Route path="top-up" element={<TopUpPaymentForm />} />
            <Route path="staff-management" element={<StaffManagement />} />
            <Route path="staff-management/add" element={<AddStaff />} />
            <Route path="staff-management/view/:id" element={<ViewStaff />} />
            <Route path="staff-management/edit/:id" element={<EditStaff />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="announcement-dashboard" element={<AnnouncementDashboard />} />
            <Route path="maintenance" element={<MaintenanceManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="permissions" element={<PermissionsPage />} />
            <Route path="disbursements" element={<AdminDisbursement />} />
            <Route path="refunds" element={<RefundRequests />} />
            <Route path="resident-lookup" element={<ResidentLookup />} />
            <Route path="edit-resident" element={<EditResident />} />
            <Route path="report" element={<Report />} />
          </Route>

          {/* === Super Admin only === */}
          <Route element={<RoleRoute allowedRoles={["super_admin"]} />}>
            <Route path="approve-hostel" element={<ApproveHostel />} />
            <Route path="users" element={<Users />} />
            <Route path="hostel-management" element={<HostelManagement />} />
            <Route path="disbursement-management" element={<DisbursementManagement />} />
          </Route>

          {/* === Staff only (scoped to operational tasks) === */}
          <Route element={<RoleRoute allowedRoles={["staff"]} />}>
            <Route path="visitor-management" element={<VisitorManagement />} />
          </Route>

          {/* === Resident only === */}
          <Route element={<RoleRoute allowedRoles={["resident"]} />}>
            <Route path="view-room-details" element={<ResidentRoomDetails />} />
            <Route path="allocation-details" element={<AllocationDetails />} />
            <Route path="make-request" element={<MakeRequest />} />
            <Route path="payment-billing" element={<PaymentBilling />} />
            <Route path="view-announcements" element={<Announcements />} />
            <Route path="documents" element={<Documents />} />
            <Route path="feedback" element={<Feedback />} />
          </Route>

        </Route>
      </Route>

        {/* Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
