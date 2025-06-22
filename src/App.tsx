import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import axios from "axios";
import { Loader } from "lucide-react";

import Layout from "@components/layout/Layout";
import LandingPageLayout from "./components/layout/LandingPageLayout";
import PrivateRoute from "./components/routes/PrivateRoute";
import Home from './pages/landing-page/page'
import About from './pages/landing-page/About'
import Contact from './pages/landing-page/Contact'
import FindHostel from './pages/landing-page/component/findHostel/page'
import LoginForm from "./pages/Authentication/login/login-form";
import Settings  from "./pages/dashboard/settings/Settings"
import ResidentLookup from "./pages/dashboard/resident-management/Resident-lookup";
import ChangePassword from "./components/changepassword/ChangePassword";
import ForgetPassword from "./pages/Authentication/forget-password/ForgetPassword";
// Axios base config
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}`;
const token = localStorage.getItem("token");
if (token && token !== "undefined" && token !== null) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Lazy loaded components
const Dashboard = lazy(() => import("@pages/dashboard/Dashboard"));
const RoomManagementTab = lazy(() => import("@pages/dashboard/room-management/RoomManagementTab"));
const RoomAssignmentAndPayment = lazy(() => import("@/components/rooms/room-assignment/RoomAssignmentAndPayment"));
const ResidentManagement = lazy(() => import("@pages/dashboard/resident-management/ResidentManagement"));
const VisitorManagement = lazy(() => import("@pages/dashboard/visitor-management/VisitorManagement"));
const StaffManagement = lazy(() => import("@pages/dashboard/staff-management/StaffManagement"));
const AddStaff = lazy(() => import("@/components/staff/AddStaff"));
const DeptorsList = lazy(() => import("./pages/dashboard/deptors-list/DeptorsList"));
const HostelListingForm = lazy(() => import("./pages/landing-page/component/hostel-listing/Hostel-Listing-Form"));
const PaymentSummaryForm = lazy(() => import("./components/payment/PaymentSummaryForm"));
const TopUpPaymentForm = lazy(() => import("./components/payment/TopUpPaymentForm"))
const ResidentForm = lazy(() => import("./pages/landing-page/component/resident-forms/ResidentForm"));
const AddResident = lazy(() => import("./components/resident/AddResident"));
const ApproveHostel = lazy(() => import("./pages/dashboard/approvals/Approve-Hostel"));
const ProfileForm = lazy(() => import("./pages/dashboard/profile/Profile-From"));
const EditStaff = lazy(() => import("./components/staff/EditStaff"));
const CalendarYear = lazy(() => import("./pages/dashboard/calendarYear/CalendarYear"));
const Transactions = lazy(() => import("./pages/dashboard/transactions/Transactions"));
const Users = lazy(() => import("./pages/dashboard/users/Users"));
const ViewRoom = lazy(() => import("./components/rooms/ViewRoom"));
const FindRoom = lazy(() => import("./pages/landing-page/component/find-room/Find-Room"));
const HostelManagement = lazy(() => import("./pages/dashboard/hostelManagement/HostelManagement"));

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
        {/* Landing Routes */}
        <Route element={<LandingPageLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About/>}/>
          <Route path="contact" element={<Contact/>}/>
          <Route path="find-hostel" element={<FindHostel />} />
          <Route path="hostel-listing" element={<HostelListingForm />} />
          <Route path="payment" element={<PaymentSummaryForm/>} />
          
          <Route path="resident-form" element={<ResidentForm />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="find/:id/room" element={<FindRoom />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="forget-password" element={<ForgetPassword />} />
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
            <Route path="deptors-list" element={<DeptorsList />} />
             <Route path="payment" element={<PaymentSummaryForm/>} />
            <Route path="top-up" element={<TopUpPaymentForm/>} />
            <Route path="visitor-management" element={<VisitorManagement />} />
            <Route path="staff-management" element={<StaffManagement />} />
            <Route path="staff-management/add" element={<AddStaff />} />
            <Route path="staff-management/edit/:id" element={<EditStaff />} />
            <Route path="approve-hostel" element={<ApproveHostel />} />
            <Route path="profile" element={<ProfileForm />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="users" element={<Users />} />
            <Route path="view-room/:id" element={<ViewRoom />} />
            <Route path="hostel-management" element={<HostelManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="resident-lookup" element={<ResidentLookup />} />
          </Route>
        </Route>

        {/* Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
