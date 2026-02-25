import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader } from "lucide-react";

import Layout from "@components/layout/Layout";
import LandingPageLayout from "./components/layout/LandingPageLayout";
import PrivateRoute from "./components/routes/PrivateRoute";
import ProtectedBookingRoute from "./components/routes/ProtectedBookingRoute";

// Landing page routes - lazy loaded
const Home = lazy(() => import('./pages/landing-page/page'));
const About = lazy(() => import('./pages/landing-page/About'));
const Contact = lazy(() => import('./pages/landing-page/Contact'));
const Services = lazy(() => import('./pages/landing-page/Services'));
const FindHostel = lazy(() => import('./pages/landing-page/component/findHostel/page'));
const FindRoom = lazy(() => import('./pages/landing-page/component/find-room/Find-Room'));
const ResidentForm = lazy(() => import('./pages/landing-page/component/resident-forms/ResidentForm'));
const HostelListingForm = lazy(() => import('./pages/landing-page/component/hostel-listing/Hostel-Listing-Form'));

// Authentication routes - lazy loaded
const LoginForm = lazy(() => import("./pages/Authentication/login/login-form"));
const RegisterForm = lazy(() => import("./pages/Authentication/register/register-form"));
const ForgetPassword = lazy(() => import("./pages/Authentication/forget-password/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/Authentication/reset-password/ResetPassword"));
const ChangePassword = lazy(() => import("./components/changepassword/ChangePassword"));

// Dashboard routes - lazy loaded
const Dashboard = lazy(() => import("@pages/dashboard/Dashboard"));
const RoomManagementTab = lazy(() => import("@pages/dashboard/room-management/RoomManagementTab"));
const RoomAssignmentAndPayment = lazy(() => import("@/components/rooms/room-assignment/RoomAssignmentAndPayment"));
const ResidentManagement = lazy(() => import("@pages/dashboard/resident-management/ResidentManagement"));
const VisitorManagement = lazy(() => import("@pages/dashboard/visitor-management/VisitorManagement"));
const StaffManagement = lazy(() => import("@pages/dashboard/staff-management/StaffManagement"));
const AddStaff = lazy(() => import("@/components/staff/AddStaff"));
const EditStaff = lazy(() => import("@/components/staff/EditStaff"));
const ViewStaff = lazy(() => import("@/components/staff/ViewStaff"));
const DeptorsList = lazy(() => import("./pages/dashboard/deptors-list/DeptorsList"));
const ApproveHostel = lazy(() => import("./pages/dashboard/approvals/Approve-Hostel"));
const ProfileForm = lazy(() => import("./pages/dashboard/profile/Profile"));
const CalendarYear = lazy(() => import("./pages/dashboard/calendarYear/CalendarYear"));
const Transactions = lazy(() => import("./pages/dashboard/transactions/Transactions"));
const Users = lazy(() => import("./pages/dashboard/users/Users"));
const HostelManagement = lazy(() => import("./pages/dashboard/hostelManagement/HostelManagement"));
const Settings = lazy(() => import("./pages/dashboard/settings/Settings"));
const ResidentLookup = lazy(() => import("./pages/dashboard/resident-management/Resident-lookup"));
const EditResident = lazy(() => import("./components/resident/EditResident"));
const Report = lazy(() => import('./pages/dashboard/report/Report'));

// Component routes - lazy loaded
const PaymentSummaryForm = lazy(() => import("./components/payment/PaymentSummaryForm"));
const TopUpPaymentForm = lazy(() => import("./components/payment/TopUpPaymentForm"));
const AddResident = lazy(() => import("./components/resident/AddResident"));
const ViewRoom = lazy(() => import("./components/rooms/ViewRoom"));
const PaymentSuccess = lazy(() => import('@components/payment-success'));
const TermsAndCondition = lazy(() => import("./components/TermsAndConditions"));

// Resident portal routes - lazy loaded
const ResidentRoomDetails = lazy(() => import("./pages/dashboard/resident-management/ResidentRoomDetails"));
const ViewResident = lazy(() => import("./pages/dashboard/resident-management/ViewResident"));
const MakeRequest = lazy(() => import("./pages/dashboard/resident-management/MakeRequest"));
const PaymentBilling = lazy(() => import("./pages/dashboard/resident-management/PaymentBilling"));
const Announcements = lazy(() => import("./pages/dashboard/resident-management/Announcements"));
const Documents = lazy(() => import("./pages/dashboard/resident-management/Documents"));
const Feedback = lazy(() => import("./pages/dashboard/resident-management/Feedback"));
const AllocationDetails = lazy(() => import("./pages/dashboard/resident-management/AllocationDetails"));
const ReceiptPage = lazy(() => import("./pages/dashboard/resident-management/ReceiptPage"));
const PaymentResult = lazy(() => import("./pages/dashboard/payment-result/PaymentResult"));

// Admin routes - lazy loaded
const AnnouncementDashboard = lazy(() => import("./pages/dashboard/admin/AnnouncementDashboard"));
const MaintenanceManagement = lazy(() => import("./pages/dashboard/admin/MaintenanceManagement"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="grid w-screen h-screen place-items-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      }
    >
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
        </Route>

        {/* Landing Routes */}
        <Route element={<LandingPageLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="services" element={<Services />} />
          <Route path="find-hostel" element={<FindHostel />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="room-management" element={<RoomManagementTab />} />
            <Route path="calendar-year-management" element={<CalendarYear />} />
            <Route path="room-assignment" element={<RoomAssignmentAndPayment />} />
            <Route path="resident-management" element={<ResidentManagement />} />
            <Route path="resident-management/add-resident" element={<AddResident />} />
            <Route path="view-resident" element={<ViewResident />} />
            <Route path="deptors-list" element={<DeptorsList />} />
            <Route path="payment" element={<PaymentSummaryForm />} />
            <Route path="top-up" element={<TopUpPaymentForm />} />
            <Route path="visitor-management" element={<VisitorManagement />} />
            <Route path="staff-management" element={<StaffManagement />} />
            <Route path="staff-management/add" element={<AddStaff />} />
            <Route path="staff-management/view/:id" element={<ViewStaff />} />
            <Route path="staff-management/edit/:id" element={<EditStaff />} />
            <Route path="approve-hostel" element={<ApproveHostel />} />
            <Route path="profile" element={<ProfileForm />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="users" element={<Users />} />
            <Route path="view-room/:id" element={<ViewRoom />} />
            <Route path="view-room-details" element={<ResidentRoomDetails />} />
            <Route path="allocation-details" element={<AllocationDetails />} />
            <Route path="make-request" element={<MakeRequest />} />
            <Route path="payment-billing" element={<PaymentBilling />} />
            <Route path="view-announcements" element={<Announcements />} />
            <Route path="documents" element={<Documents />} />
            <Route path="receipt/:reference" element={<ReceiptPage />} />
            <Route path="payment-result" element={<PaymentResult />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="hostel-management" element={<HostelManagement />} />
            <Route path="maintenance" element={<MaintenanceManagement />} />
            <Route path="announcement-dashboard" element={<AnnouncementDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="resident-lookup" element={<ResidentLookup />} />
            <Route path="edit-resident" element={<EditResident />} />
            <Route path="report" element={<Report />} />
          </Route>
        </Route>

        {/* Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
