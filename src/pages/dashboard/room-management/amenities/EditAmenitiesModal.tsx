import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from '@/components/Modal';
import { Plus } from 'lucide-react';
import { updateAmenity } from "@/api/amenities";
import { toast } from 'sonner';
import type { ApiError } from "@/types/dtos";
import { TextInput, FormButton } from "@/components/form";

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
            <h1 className="mb-4 text-xl md:text-2xl font-bold text-muted-foreground">Update Amenity</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 mb-4 space-y-4">
                <TextInput
                    {...register('name', { required: 'Amenity name is required' })}
                    placeholder="Enter amenity name"
                    error={errors.name?.message}
                />

                <TextInput
                    {...register('price', {
                        required: 'Price is required',
                        min: { value: 0, message: 'Price cannot be negative' }
                    })}
                    type="number"
                    placeholder="Price"
                    error={errors.price?.message}
                    min="0"
                    step="0.01"
                />

                <FormButton
                    type="submit"
                    className="w-full"
                    loading={AddAmenitiesMutation.isPending}
                    loadingText="Updating..."
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Update Amenity
                </FormButton>
            </form>
        </Modal>
    );
};

export default EditAmenitiesModal;