import React from 'react'
import  { TableColumn } from 'react-data-table-component';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Loader } from 'lucide-react';
import CustomDataTable from '@/components/CustomDataTable';
import { Hostel } from '@/helper/types/types';


const ApproveHostelTable = () => {
    const queryClient = useQueryClient();
    const { data:UnverifiedHostels, isLoading, isError,refetch:refetchUnverifiedHostels } = useQuery<Hostel[]>({
        queryKey: ['unverifiedHostels'],
        queryFn: async () => {
            const response = await axios.get('/api/hostels/unverified', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response?.data?.data;
        },
    });

    const AcceptMutation = useMutation({
        mutationFn: async (hostelId: string) => {
            try {
                const response = await axios.post(`/api/hostels/verify/${hostelId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Hostel Approved Successfully')
            queryClient.invalidateQueries({ queryKey: ['hostels'] });
            refetchUnverifiedHostels()
            return response?.data;
            } catch (error) {
                const err = error as Error
                  const errorMessage = err?.message || 'Failed to Approve Hostel';
                toast.error(errorMessage);
            }
            
        },
    });

    const DeclineMutation = useMutation({
        mutationFn: async (hostelId: string) => {
            try {
                 const response = await axios.delete(`/api/hostels/delete/${hostelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
             toast.success('Hostel Declined Successfully');
            queryClient.invalidateQueries({ queryKey: ['hostels'] });
            refetchUnverifiedHostels()
            return response?.data;
            } catch (error:any) {
                  const errorMessage = error?.response?.data?.message || 'Failed to Decline Hostel';
                toast.error(errorMessage);
            }
           
        },
    });

    const handleAccept = (id: string) => {
        Swal.fire({
            title: 'Are you sure you want to Approve this hostel?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, approve it!'
        }).then((result) => {
            if (result.isConfirmed) {
                AcceptMutation.mutate(id);
            }
        });
    };

    const handleDecline = (id: string) => {
        Swal.fire({
            title: 'Are you sure you want to Decline this hostel?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, decline it!'
        }).then((result) => {
            if (result.isConfirmed) {
                DeclineMutation.mutate(id);
            }
        });
    };

    const columns: TableColumn<Hostel>[] = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Address',
            cell: row => <span>{row.address}</span>,
            sortable: true,
        },
        {
            name: 'Location',
            selector: row => row.location,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Email',
            cell: row => <span>{row.email}</span>,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className='w-full flex flex-col lg:flex-row gap-2 my-2'>
                    <button className='w-full flex justify-center items-center bg-black text-white rounded px-2 py-1 text-nowrap' onClick={() => handleAccept(row.id)}>
                        {AcceptMutation.isPending ? <Loader className='animate-spin' /> : 'Approve'}
                    </button>
                    <button className='w-full flex justify-center items-center bg-red-400 text-white text-nowrap rounded px-2 py-1' onClick={() => handleDecline(row.id)}>
                        {DeclineMutation.isPending ? <Loader className='animate-spin' /> : 'Decline'}
                    </button>
                </div>
            ),
        },
    ];

  return (
     <div className='p-6 border shadow-md rounded-lg bg-white'>
            <CustomDataTable
                columns={columns}
                data={UnverifiedHostels || []}
                title='Unverified Hostels Table'
                isError={isError}
                isLoading={isLoading}
                refetch={refetchUnverifiedHostels}
            />
        </div>
  )
}

export default ApproveHostelTable