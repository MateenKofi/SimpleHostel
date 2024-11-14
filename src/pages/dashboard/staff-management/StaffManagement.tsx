import React from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useStaffStore } from '../../../stores/staffStore';

const StaffManagement: React.FC = () => {
  const navigate = useNavigate();
  const { staffList } = useStaffStore();

  const columns = [
    {
      name: 'Name',
      selector: (row: any) => 
        `${row.firstName} ${row.middleName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: 'Gender',
      selector: (row: any) => row.gender,
      sortable: true,
    },
    {
      name: 'Nationality', 
      selector: (row: any) => row.nationality,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: any) => row.staffStatus,
      sortable: true,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <button
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => navigate('/staff-management/add')}
        >
          Add Staff
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <DataTable
          columns={columns}
          data={staffList}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          highlightOnHover
          pointerOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default StaffManagement;