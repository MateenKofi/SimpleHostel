import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from '@components/layout/Layout';
import Dashboard from '@pages/dashboard/Dashboard';
import RoomManagementTab from '@pages/room-management/RoomManagementTab';
import RoomAssignmentAndPayment from '@pages/dashboard/resident-management/room-assignment/RoomAssignmentAndPayment';
import ResidentManagement from '@pages/dashboard/resident-management/ResidentManagement';
import VisitorManagement from '@pages/dashboard/visitor-management/VisitorManagement';
import StaffManagement from '@pages/dashboard/staff-management/StaffManagement';
import AddStaff from '@pages/dashboard/staff-management/AddStaff';
import RoomBooking from '@pages/roombooking/RoomBooking';
import BookingForms from '@pages/roombooking/BookingForms';
import RoomVerification from '@pages/roombooking/RoomVerification';
import Maintenance from '@pages/maintenance&Tracking/maintenace';
import DeptorsList from './pages/dashboard/deptors-list/DeptorsList';
import Home from './pages/landing-page/page'
import LandingPageLayout from './components/layout/LandingPageLayout';
import {FindHostel} from './pages/landing-page/component/findHostel/find-hostel';
import HostelListingForm from './pages/landing-page/component/hostel-listing/Hostel-Listing-Form';
import Payment from './pages/landing-page/component/payment/Payment';
import ResidentForm from './pages/landing-page/component/resident-forms/ResidentForm';
import LoginForm from './pages/Authentication/login/login-form';
import ApproveHostel from './pages/dashboard/approvals/Approve-Hostel'
import ProfileForm from './pages/dashboard/profile/Profile-From'
import EditStaff from './pages/dashboard/staff-management/EditStaff';

axios.defaults.headers.common["Accept"] = "application/json";
  axios.defaults.headers.common["Content-Type"] = "application/json";
  // axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem('token')}`;
  axios.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}`

  // axios.defaults.withCredentials = true;
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  // axios.defaults.headers.common["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
  // axios.defaults.headers.common["Access-Control-Allow-Headers"] = "Origin, Content-Type, X-Auth-Token";
  // axios.defaults.headers.common["Access-Control-Allow-Credentials"] = "true";
function App() {
  return (
    <Routes>
      <Route path='/dashboard' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="room-management" element={<RoomManagementTab/>} />
        <Route path='room-assignment/:residentId' element={<RoomAssignmentAndPayment />} />
        <Route path="resident-management" element={<ResidentManagement />} />
        <Route path='deptors-list' element={<DeptorsList/>}/>
        <Route path="visitor-management" element={<VisitorManagement />} />
        <Route path="staff-management" element={<StaffManagement />} />
        <Route path="staff-management/Edit/:id" element={<EditStaff />} />
        <Route path="maintenance-and-tracking" element={<Maintenance />}/>
        <Route path="staff-management/add" element={<AddStaff />} />
        <Route path="approve-hostel" element={<ApproveHostel />} />
        <Route path="profile" element={<ProfileForm />} />
      </Route>

      <Route path='/' element={<LandingPageLayout/>} >
        <Route index element={<Home />} />
        <Route path='find-hostel' element={<FindHostel />} />
        <Route path='hostel-listing' element={<HostelListingForm/>} />
        <Route path='payment' element={<Payment/>} />
        <Route path='resident-form' element={<ResidentForm/>} />
        <Route path='login' element={<LoginForm/>} />
      </Route>
      
      <Route path='room-booking-form' element={<BookingForms />} />
      <Route path='online-resident-booking' element={<RoomBooking />} />
      <Route path='room-verification' element={<RoomVerification/>} />
     
    </Routes>
  );
}

export default App;