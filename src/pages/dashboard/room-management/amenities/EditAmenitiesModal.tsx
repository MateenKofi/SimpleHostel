import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from '@/components/Modal';
import { Loader, Plus } from 'lucide-react';
import { updateAmenity } from "@/api/amenities";
import { toast } from 'sonner';
import type { ApiError } from "@/types/dtos";

interface Amenity {
    id: string;
    name: string;
    price: number;
}

type AmenityFormData = Amenity & { hostelId: string | null };

interface EditAmenitiesModalProps {
    onClose: () => void;
    formdata: Amenity;
}

const EditAmenitiesModal: React.FC<EditAmenitiesModalProps> = ({ onClose, formdata }) => {
    const queryClient = useQueryClient();
    const hostelId = localStorage.getItem('hostelId');

    const AddAmenitiesMutation = useMutation({
        mutationFn: async (data: AmenityFormData) => {
            return await updateAmenity(formdata.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['amenities'] });
            toast.success("Amenity Updated Successfully");
            onClose();
        },
        onError: (error: ApiError) => {
            const errorMessage =
                error.response?.data?.message || "Failed to Update Amenity";
            toast.error(errorMessage);
        },
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm<AmenityFormData>({
        defaultValues: formdata,
    });

    useEffect(() => {
        reset(formdata);
    }, [formdata, reset]);

    const onSubmit = (data: AmenityFormData) => {
        AddAmenitiesMutation.mutate({ ...data, hostelId });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal modalId='edit_amenities_modal' onClose={handleClose}>
            <h1 className="mb-4 text-2xl font-bold text-gray-500">Update Amenity</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 mb-4">
                <div className="flex gap-2">
                    <input
                        {...register('name', { required: 'Amenity name is required' })}
                        type="text"
                        placeholder="Enter amenity name"
                        className="flex-1 px-3 py-2 border rounded-md"
                    />
                    {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
                    <input
                        {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })}
                        type="number"
                        placeholder="Price"
                        className="w-32 px-3 py-2 border rounded-md"
                        min="0"
                        step="0.01"
                    />
                    {errors.price && <span className="text-sm text-red-500">{errors.price.message}</span>}
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 text-white bg-black rounded-md"
                    >
                        {AddAmenitiesMutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> :
                            (
                                <div className='flex items-center gap-2'>
                                    <Plus className="w-4 h-4" />
                                    <span className="text-nowrap">
                                        Update Amenity
                                    </span>
                                </div>
                            )
                        }
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditAmenitiesModal;