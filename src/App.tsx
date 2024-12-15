import { Routes, Route } from 'react-router-dom';
import Layout from '@components/layout/Layout';
import Dashboard from '@pages/dashboard/Dashboard';
import RoomManagement from '@pages/room-management/RoomManagement';
import RoomAssignmentAndPayment from '@pages/dashboard/resident-management/room-assignment/RoomAssignmentAndPayment';
import ResidentManagement from '@pages/dashboard/resident-management/ResidentManagement';
import VisitorManagement from '@pages/dashboard/visitor-management/VisitorManagement';
import StaffManagement from '@pages/dashboard/staff-management/StaffManagement';
import AddStaff from '@pages/dashboard/staff-management/AddStaff';
import RoomBooking from '@pages/roombooking/RoomBooking';
import BookingForms from '@pages/roombooking/BookingForms';
import RoomVerification from '@pages/roombooking/RoomVerification';
import Maintenance from '@pages/maintenance&Tracking/maintenace';
import AnalyticsDashboard from './pages/reportAndAnalytics/analytics-dashboard';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/room-management" element={<RoomManagement />} />
        <Route path='/room-assignment/:residentId' element={<RoomAssignmentAndPayment />} />
        {/* <Route path="/online-resident-booking" element={<RoomBooking />} /> */}
        <Route path="/resident-management" element={<ResidentManagement />} />
        <Route path="/visitor-management" element={<VisitorManagement />} />
        <Route path="/staff-management" element={<StaffManagement />} />
        <Route path="/maintenance-and-tracking" element={<Maintenance />}/>
        <Route path="/report-and-analytics" element={<AnalyticsDashboard />} />  {/* Edit staff */}
        <Route path="/staff-management/add" element={<AddStaff />} />
      </Route>
      
      <Route path='/room-booking-form' element={<BookingForms />} />
      <Route path='/online-resident-booking' element={<RoomBooking />} />
      <Route path='/room-verification' element={<RoomVerification/>} />
    </Routes>
  );
}

export default App;