import React from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useStaffStore } from '../../../stores/staffStore';
import { Staff } from '../../../types/types';
import { Edit, Trash2 } from 'lucide-react';
const StaffManagement: React.FC = () => {
  const navigate = useNavigate();
  const { staffList } = useStaffStore();

  const columns = [
    {
      name: 'Name',
      grow: 2,
      selector: (row: Staff) => 
        `${row.firstName} ${row.middleName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: 'Gender',
      selector: (row: Staff) => row.gender,
      sortable: true,
    },
    {
      name: 'Nationality', 
      selector: (row: Staff) => row.nationality,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: Staff) => row.staffStatus,
      sortable: true,
    },
    {
      name: 'Actions',
      grow:2,
      cell: (row: Staff) => (
        <div className="flex space-x-2">
          <button
            className="flex gap-2 items-center px-2 py-1 bg-primary text-white rounded-md"
            onClick={() => navigate(`/staff-management/${row.id}`)}
          >
            <Edit size={14}/>
            <span>
            Edit
            </span>
          </button>
          <button
            className="flex gap-2 items-center px-2 py-1 bg-red-500 text-white rounded-md"
            onClick={() => navigate(`/staff-management/${row.id}`)}
          >
            <Trash2 size={14}/>
            <span>
            Delete
            </span>
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <button
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => navigate('/dashboard/staff-management/add')}
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