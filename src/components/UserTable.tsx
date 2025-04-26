import React from 'react'
import { useQuery,useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Users } from '@/helper/types/types'
import { TableColumn } from 'react-data-table-component'
import CustomDataTable from './CustomDataTable'
import {  Trash2 } from 'lucide-react'
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast'


const UserTable = () => {
    const {data:AllUsers,isLoading,isError,refetch:refetchAllUsers} = useQuery({
        queryKey:['AllUsers'],
        queryFn: async () => {
            const response = await axios.get(`/api/users/get`,{
                headers :{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response.data
        }
    })

       const DeleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
          try {
            const response = await axios.delete(`/api/users/delete/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
              },
            });
            toast.success("User deleted successfully");
            refetchAllUsers();
            return response.data;
          } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Failed to delete user";
            toast.error(errorMessage);
          }
        },
      });
    
    const handleDeleteUser = (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this user!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                DeleteUserMutation.mutate(id);
            }
        });
    }

    const columns: TableColumn<Users>[] =[
    {name: 'Name', selector:(row)=> row.name, sortable:true},
    {name: 'Email', selector:(row)=> row.email, sortable:true},
    {name: 'Phone', selector: (row)=> row.phoneNumber,},
    {name: 'Role',center:true, cell: (row) => (
        <span className={`w-fit rounded-md text-center px-2 py-1 ${row.role === 'SUPER_ADMIN' ? 'bg-green-400/50 text-white' : row.role === 'user' ? 'bg-blue-500 text-white' : 'bg-yellow-400/50 text-white'}`}>
            {row.role}
        </span>
    ), sortable: true},
    {name: 'Action',center:true, cell: (row) => (
       <span>
        <button className='bg-red-500 text-white rounded-md px-2 py-1 ml-2'
        onClick={()=>handleDeleteUser(row.id)}
        >
            <Trash2/>
        </button>
       </span>
    ), sortable: true},

]
  return (
    <div className='p-6 border shadow-sm rounded-md'>
        <CustomDataTable
        title='User Management Table'
        data={AllUsers}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        />
    </div>
  )
}

export default UserTable