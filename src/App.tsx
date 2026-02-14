import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { Loader } from "lucide-react";

import Layout from "@components/layout/Layout";
import LandingPageLayout from "./components/layout/LandingPageLayout";
import PrivateRoute from "./components/routes/PrivateRoute";
import Home from './pages/landing-page/page'
import About from './pages/landing-page/About'
import Contact from './pages/landing-page/Contact'
import Services from './pages/landing-page/Services'
import FindHostel from './pages/landing-page/component/findHostel/page'
import LoginForm from "./pages/Authentication/login/login-form";
import RegisterForm from "./pages/Authentication/register/register-form";
import Settings from "./pages/dashboard/settings/Settings"
import ResidentLookup from "./pages/dashboard/resident-management/Resident-lookup";
import ChangePassword from "./components/changepassword/ChangePassword";
import ForgetPassword from "./pages/Authentication/forget-password/ForgetPassword";
import TermsAndCondition from "./components/TermsAndConditions";



import Dashboard from "@pages/dashboard/Dashboard";
import RoomManagementTab from "@pages/dashboard/room-management/RoomManagementTab";
import RoomAssignmentAndPayment from "@/components/rooms/room-assignment/RoomAssignmentAndPayment";
import ResidentManagement from "@pages/dashboard/resident-management/ResidentManagement";
import VisitorManagement from "@pages/dashboard/visitor-management/VisitorManagement";
import StaffManagement from "@pages/dashboard/staff-management/StaffManagement";
import AddStaff from "@/components/staff/AddStaff";
import DeptorsList from "./pages/dashboard/deptors-list/DeptorsList";
import HostelListingForm from "./pages/landing-page/component/hostel-listing/Hostel-Listing-Form";
import PaymentSummaryForm from "./components/payment/PaymentSummaryForm";
import TopUpPaymentForm from "./components/payment/TopUpPaymentForm";
import ResidentForm from "./pages/landing-page/component/resident-forms/ResidentForm";
import AddResident from "./components/resident/AddResident";
import ApproveHostel from "./pages/dashboard/approvals/Approve-Hostel";
import ProfileForm from "./pages/dashboard/profile/Profile";
import EditStaff from "./components/staff/EditStaff";
import CalendarYear from "./pages/dashboard/calendarYear/CalendarYear";
import Transactions from "./pages/dashboard/transactions/Transactions";
import Users from "./pages/dashboard/users/Users";
import ViewRoom from "./components/rooms/ViewRoom";
import FindRoom from "./pages/landing-page/component/find-room/Find-Room";
import HostelManagement from "./pages/dashboard/hostelManagement/HostelManagement";
import EditResident from "./components/resident/EditResident";
import Report from './pages/dashboard/report/Report';
import PaymentSuccess from '@components/payment-success';
import ResidentRoomDetails from "./pages/dashboard/resident-management/ResidentRoomDetails";
import ViewResident from "./pages/dashboard/resident-management/ViewResident";
import MakeRequest from "./pages/dashboard/resident-management/MakeRequest";
import PaymentBilling from "./pages/dashboard/resident-management/PaymentBilling";
import Announcements from "./pages/dashboard/resident-management/Announcements";
import Documents from "./pages/dashboard/resident-management/Documents";
import Feedback from "./pages/dashboard/resident-management/Feedback";
import AnnouncementDashboard from "./pages/dashboard/admin/AnnouncementDashboard";
import AllocationDetails from "./pages/dashboard/resident-management/AllocationDetails";
import ReceiptPage from "./pages/dashboard/resident-management/ReceiptPage";
import MaintenanceManagement from "./pages/dashboard/admin/MaintenanceManagement";

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
        <Route path="payment" element={<PaymentSummaryForm />} />
        <Route path='terms-and-conditions' element={<TermsAndCondition />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="payment-success" element={<PaymentSuccess />} />

        {/* Landing Routes */}
        <Route element={<LandingPageLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="services" element={<Services />} />
          <Route path="find-hostel" element={<FindHostel />} />

          <Route path="resident-form" element={<ResidentForm />} />
          <Route path="find/:id/room" element={<FindRoom />} />

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
