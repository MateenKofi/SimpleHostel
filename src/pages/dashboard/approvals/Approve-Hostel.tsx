import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Loader } from 'lucide-react';

interface Hostel {
    id: string;
    name: string;
    address: string;
    location: string;
    phone: string;
    email: string;
    ghCard: string;
    isVerified: boolean;
}

const ApproveHostel: React.FC = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery<Hostel[]>({
        queryKey: ['hostels'],
        queryFn: async () => {
            const response = await axios.get('/api/hostels/get', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response?.data?.data;
        },
    });

    const AcceptMutation = useMutation({
        mutationFn: async (hostelId: string) => {
            const response = await axios.post(`/api/hostels/verify/${hostelId}`, 
                {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              }
            }
            );
            return response?.data;
        },
        onSuccess: (response) => {
            toast.success('Hostel Approved Successfully');
            toast.success(response?.data?.message);
            queryClient.invalidateQueries({ queryKey: ['hostels'] });
        },
        onError: (error: any) => {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || 'Failed to Approve Hostel';
                toast.error(errorMessage);
            } else {
                toast.error('Failed to Approve Hostel');
            }
        },
    });

    const DeclineMutation = useMutation({
        mutationFn: async (hostelId: string) => {
            const response = await axios.delete(`/api/hostels/delete/${hostelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response?.data;
        },
        onSuccess: (response) => {
            toast.success('Hostel Declined Successfully');
            queryClient.invalidateQueries({ queryKey: ['hostels'] });
        },
        onError: (error: any) => {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || 'Failed to Decline Hostel';
                toast.error(errorMessage);
            } else {
                toast.error('Failed to Decline Hostel');
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
            name: 'Ghana Card',
            selector: row => row.ghCard,
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

    if (isLoading) {
        return <div className='w-full h-[70dvh] grid place-items-center'>
            <img src="/logo.png" alt="Loading" className='w-20 h-20 animate-ping' />
        </div>;
    }

    if (isError) {
        return <div>Error loading data</div>;
    }

    // Filter the data to only include hostels that are not verified
    const filteredData = data?.filter(hostel => !hostel.isVerified) || [];

    const conditionalRowStyles = [
        {
            when: (row: Hostel) => data?.indexOf(row) % 2 === 0,
            style: {
                backgroundColor: '#f2f2f2',
            },
        },
    ];

    return (
        <div className='p-6'>
            <DataTable
                title="Approve Hostels"
                columns={columns}
                data={filteredData}
                pagination
                responsive
                conditionalRowStyles={conditionalRowStyles}
            />
        </div>
    );
};

export default ApproveHostel;