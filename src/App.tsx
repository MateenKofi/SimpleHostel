import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import axios from 'axios';
import Layout from '@components/layout/Layout';
import LandingPageLayout from './components/layout/LandingPageLayout';
import {Divide, Loader} from 'lucide-react';

// Lazy load components
const Dashboard = lazy(() => import('@pages/dashboard/Dashboard'));
const RoomManagementTab = lazy(() => import('@pages/room-management/RoomManagementTab'));
const RoomAssignmentAndPayment = lazy(() => import('@pages/dashboard/resident-management/room-assignment/RoomAssignmentAndPayment'));
const ResidentManagement = lazy(() => import('@pages/dashboard/resident-management/ResidentManagement'));
const VisitorManagement = lazy(() => import('@pages/dashboard/visitor-management/VisitorManagement'));
const StaffManagement = lazy(() => import('@pages/dashboard/staff-management/StaffManagement'));
const AddStaff = lazy(() => import('@pages/dashboard/staff-management/AddStaff'));
const Maintenance = lazy(() => import('@/pages/dashboard/maintenance&Tracking/maintenace'));
const DeptorsList = lazy(() => import('./pages/dashboard/deptors-list/DeptorsList'));
const Home = lazy(() => import('./pages/landing-page/page'));
const FindHostel = lazy(() => import('./pages/landing-page/component/findHostel/page'));
const HostelListingForm = lazy(() => import('./pages/landing-page/component/hostel-listing/Hostel-Listing-Form'));
const PaymentForm = lazy(() => import('./components/payment/Payment'));
const ResidentForm = lazy(() => import('./pages/landing-page/component/resident-forms/ResidentForm'));
const LoginForm = lazy(() => import('./pages/Authentication/login/login-form'));
const ApproveHostel = lazy(() => import('./pages/dashboard/approvals/Approve-Hostel'));
const ProfileForm = lazy(() => import('./pages/dashboard/profile/Profile-From'));
const EditStaff = lazy(() => import('./pages/dashboard/staff-management/EditStaff'));
const CalendarYear = lazy(() => import('./pages/dashboard/calendarYear/CalendarYear'));
const Payment = lazy(() => import('./pages/dashboard/resident-management/room-assignment/Payment'));

// Axios configuration
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}`;
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

function App() {
  return (
    <Suspense fallback={
    (
      <div className="w-screen h-screen grid place-items-center">
        <Loader className='animate-spin'/>
      </div>
    )
    }>
      <Routes>
        <Route path='/dashboard' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="room-management" element={<RoomManagementTab />} />
          <Route path="calendar-year-management" element={<CalendarYear />} />
          <Route path='room-assignment' element={<RoomAssignmentAndPayment />} />
          <Route path="resident-management" element={<ResidentManagement />} />
          <Route path='deptors-list' element={<DeptorsList />} />
          <Route path="visitor-management" element={<VisitorManagement />} />
          <Route path="staff-management" element={<StaffManagement />} />
          <Route path="staff-management/Edit/:id" element={<EditStaff />} />
          <Route path="maintenance-and-tracking" element={<Maintenance />} />
          <Route path="staff-management/add" element={<AddStaff />} />
          <Route path="approve-hostel" element={<ApproveHostel />} />
          <Route path="profile" element={<ProfileForm />} />
          <Route path='payment' element={<Payment />} />
        </Route>

        <Route path='/' element={<LandingPageLayout />}>
          <Route index element={<Home />} />
          <Route path='find-hostel' element={<FindHostel />} />
          <Route path='hostel-listing' element={<HostelListingForm />} />
          <Route path='payment' element={<PaymentForm amount={26666} description={''} />} />
          <Route path='resident-form' element={<ResidentForm />} />
          <Route path='login' element={<LoginForm />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;