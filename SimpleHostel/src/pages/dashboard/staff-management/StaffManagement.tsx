import SEOHelmet from '@/components/SEOHelmet';
import StaffTable from '@/components/staff/StaffTable';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StaffManagement: React.FC = () => {
const navigate = useNavigate();

  return (
    <div className="p-6">
      <SEOHelmet
      title='Staff Management - Fuse'
      description='Manage staff effectively with Fuse.'
      keywords='staff management, Fuse, hostel'
      />
      <div className="flex justify-between items-center mb-6 border p-2 rounded-md shadow-md">
       <div>
         <h1 className="text-2xl font-bold">Staff Management</h1>
         <p className="text-gray-600 text-sm mt-1">Manage all hostel staff information, roles, and statuses here.</p>
       </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-black text-white rounded-md"
            onClick={() => navigate('/dashboard/staff-management/add')}
          >
            Add Staff
          </button>
        </div>
      </div>
      <div className="bg-white border rounded-lg shadow-sm p-4">
       <StaffTable/>
      </div>
    </div>
  );
};

export default StaffManagement;
