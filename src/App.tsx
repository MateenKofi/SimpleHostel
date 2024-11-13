import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import SemesterManagement from './pages/semester-management/SemesterManagement';
import RoomAssignmentAndPayment from './pages/dashboard/resident-management/room-assignment/RoomAssignmentAndPayment';
import ResidentManagement from './pages/dashboard/resident-management/ResidentManagement';
import RoomAssignment from './pages/dashboard/resident-management/room-assignment/RoomAssignment';
import Payment from './pages/dashboard/resident-management/room-assignment/Payment';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/dashboard'  element={<Dashboard />} />
        <Route path="/semester-management" element={<SemesterManagement />} />
        <Route path="room-assignment/:residentId" element={
          <div>
            <RoomAssignment />
            <Payment />
          </div>
        } />
        <Route path="/resident-management" element={<ResidentManagement />} />
      </Route>
    </Routes>
  );
}

export default App; 