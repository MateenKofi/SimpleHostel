import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Staff } from '../../../helper/types/types';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';

const StaffManagement: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const hostelId = localStorage.getItem('hostelId') || '';

  if (!hostelId) {
    console.error('Hostel ID is not defined');
    return <div>Error: Hostel ID is not defined</div>;
  }

  // Fetch the staff data
  const { data: staffs, isLoading, isError } = useQuery({
    queryKey: ['staffs'],
    queryFn: async () => {
      const response = await axios.get(`/api/Staffs/get/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response?.data.data;
    },
  });

  // Mutation for deleting a staff member
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`/api/Staffs/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
    onSuccess: () => {
      // Refresh the staff list after deletion
      queryClient.invalidateQueries({queryKey:['staffs']});
      Swal.fire('Deleted!', 'The staff has been deleted.', 'success');
    },
    onError: () => {
      Swal.fire('Error', 'There was an error deleting the staff.', 'error');
    },
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this staff?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
    });

    if (result.isConfirmed) {
      await deleteMutation.mutateAsync(id);
    }
    setDeletingId(null);
  };

  const filteredStaffs = (staffs || []).filter((staff: Staff) =>
    `${staff.firstName} ${staff.middleName} ${staff.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: 'Name',
  
      selector: (row: Staff) =>
        `${row.firstName} ${row.middleName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: 'Gender',
      width: '100px',
      selector: (row: Staff) => row.gender,
      sortable: true,
    },
    {
      name: 'Phone',
      
      selector: (row: Staff) => row.phoneNumber,
      sortable: true,
    },
    {
      name: 'Role',
      
      selector: (row: Staff) => row.role,
      sortable: true,
    },
    {
      name: 'Qualification',
      selector: (row: Staff) => row.qualification,
      sortable: true,
    },
    {
      name: 'Block',
      selector: (row: Staff) => row.block,
      sortable: true,
    },
    {
      name: 'Actions',
      width: '100px',
      
      cell: (row: Staff) => (
        <div className="my-1 flex flex-col items-center justify-center space-y-1 text-nowrap">
          <button
            className="w-full flex gap-2 items-center px-2 py-1 bg-black text-white rounded-md"
            onClick={() => navigate(`/dashboard/staff-management/edit/${row.id}`)}
          >
            <Edit size={14} />
            <span>Edit</span>
          </button>
          <button
            className="w-full flex gap-2 items-center px-2 py-1 bg-red-500 text-white rounded-md"
            onClick={() => handleDelete(row.id)}
          >
            {deletingId === row.id ? (
              <span className="loader"></span>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      ),
    },
  ];

  if (isError) {
    return <div>Error loading staff data.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search staff..."
            className="pl-4 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-black text-white rounded-md"
            onClick={() => navigate('/dashboard/staff-management/add')}
          >
            Add Staff
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-8 gap-4 mb-4">
              <div className="col-span-2 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-2 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-8 gap-4 mb-4">
              <div className="col-span-2 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-2 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredStaffs}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
            highlightOnHover
            pointerOnHover
            responsive
          />
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
