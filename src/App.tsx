import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import SemesterManagement from './pages/semester-management/SemesterManagement';
import RoomAssignmentAndPayment from './pages/dashboard/resident-management/room-assignment/RoomAssignmentAndPayment';
import ResidentManagement from './pages/dashboard/resident-management/ResidentManagement';
import Test from './pages/livetest/Test';
import VisitorManagement from './pages/dashboard/visitor-management/VisitorManagement';



function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/semester-management" element={<SemesterManagement />} />
        <Route path='/room-assignment/:residentId' element={<RoomAssignmentAndPayment />} />
        <Route path="/resident-management" element={<ResidentManagement />} />
        <Route path='/test' element={<Test/>}/>
        <Route path="/visitor-management" element={<VisitorManagement />} />
      </Route>
    </Routes>
  );
}

export default App;