
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import SemesterManagement from './pages/semester-management/SemesterManagement';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/dashboard'  element={<Dashboard />} />
        <Route path="/semester-management" element={<SemesterManagement />} />
      </Route>
    </Routes>
  );
}

export default App; 