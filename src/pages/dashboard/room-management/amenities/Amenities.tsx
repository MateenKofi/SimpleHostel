'use client'
import { Building, Plus, Edit, Trash2, Loader } from 'lucide-react';
import { useModal } from '@/components/Modal';
import AmenitiesModal from './AmenitiesModal';
import EditAmenitiesModal from './EditAmenitiesModal';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from 'sweetalert2';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import CustomDataTable from '@/components/CustomDataTable';
import { Amenity } from '@/helper/types/types';

const Amenities = () => {
    const queryClient = useQueryClient();
    const { open: openAmenitiesModal, close: closeAmenitiesModal } = useModal('amenities_modal');
    const { open: openEditAmenitiesModal, close: closeEditAmenitiesModal } = useModal('edit_amenities_modal');
    const hostelId = localStorage.getItem('hostelId');
    const [deletingAmenityId, setDeletingAmenityId] = useState<string | null>(null);
    const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
    const { data:amenities, isLoading, isError,refetch:refetchAmenities } = useQuery<Amenity[]>({
        queryKey: ["amenities"],
        queryFn: async () => {
          const response = await axios.get(`/api/amenities/hostel/${hostelId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          return response?.data?.data;
        },
    });

    const DeleteAmenitiesMutation = useMutation({
        mutationFn: async (id: string) => {
          const response = await axios.delete(`/api/amenities/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          });
          return response?.data;
        },
        onSuccess: () => {
          toast.success("Amenity deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["amenities"] });
          setDeletingAmenityId(null);
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const errorMessage =
              error.response?.data?.message || "Failed to Update User Details";
            toast.error(errorMessage);
          },
      });
    
    const handleDeleteAmenities = (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this amenities!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setDeletingAmenityId(id);
                DeleteAmenitiesMutation.mutate(id);
            }
        });
    }

    const handleEditAmenities = (amenity: Amenity) => {
        setSelectedAmenity(amenity);
        openEditAmenitiesModal();
    }

    const columns = [
        {
            name: 'Name',
            selector: (row: { name: string }) => row.name,
            sortable: true,
        },
        {
            name: 'Price',
            selector: (row: { price: number }) => row.price,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row: Amenity) => (
                <div className="flex gap-2 text-nowrap">
                    <button className="text-white bg-black p-1 rounded flex items-center gap-1"
                        onClick={() => handleEditAmenities(row)}>
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                    <button className="text-white bg-black p-1 rounded flex items-center gap-1"
                        onClick={() => handleDeleteAmenities(row.id)}>
                        {deletingAmenityId === row.id ? <Loader className='animate-spin'/> : (
                            <div className="flex items-center gap-1">
                                 <Trash2 className="w-4 h-4" />
                                 <span>Delete</span>
                            </div>
                        )}
                    </button>
                </div>
            ),
        },
    ];


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Building className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Amenities Management</h1>
                </div>
                <div className="flex gap-2">
                    <button className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
                        onClick={() => openAmenitiesModal()}
                    >
                        <Plus />
                        <span>Amenities</span>
                    </button>
                    <AmenitiesModal onClose={closeAmenitiesModal} />
                </div>
            </div>

            {amenities?.length === 0 ? (
                <div className="w-full flex justify-center flex-col items-center gap-4 text-center py-4 mt-20">
                    <p>No amenities found. Please add some amenities.</p>
                    <div>
                        <button className="flex gap-2 px-4 py-2 bg-black text-white rounded-md"
                            onClick={() => openAmenitiesModal()}
                        >
                            <Plus />
                            <span>Amenities</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-4 ">
                    <CustomDataTable<Amenity>
                    title='Amenities Table'
                    columns={columns}
                    data={amenities || []}
                    isError={isError}
                    isLoading={isLoading}
                    refetch={refetchAmenities}
                    />
                </div>
            )}
                <EditAmenitiesModal onClose={closeEditAmenitiesModal} formdata={selectedAmenity || { id: '', name: '', price: 0 }} />
        </div>
    )
}

export default Amenities;