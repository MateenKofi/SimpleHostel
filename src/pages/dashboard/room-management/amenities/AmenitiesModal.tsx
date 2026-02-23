import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, SubmitHandler } from 'react-hook-form';
import Modal from '@/components/Modal';
import { Amenity } from '@/helper/types/types';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAmenity } from "@/api/amenities";
import type { ApiError } from "@/types/dtos";
import { TextInput, FormButton } from "@/components/form";

interface AmenitiesModalProps {
  onClose: () => void;
}

type AmenityFormData = Amenity & { hostelId: string | null };

const AmenitiesModal = ({ onClose }: AmenitiesModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AmenityFormData>();
  const queryClient = useQueryClient();
  const hostelId = localStorage.getItem('hostelId');

  const AddAmenitiesMutation = useMutation({
    mutationFn: async (data: AmenityFormData) => {
      return await addAmenity(data);
    },
    onSuccess: () => {
      toast.success("Amenities Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      reset();
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || "Failed to add Amenities";
      toast.error(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<AmenityFormData> = (data) => {
    const formattedData = {
      ...data,
      price: parseFloat(data.price as unknown as string),
      hostelId,
    };
    AddAmenitiesMutation.mutate(formattedData);
  };

  return (
    <Modal modalId='amenities_modal' onClose={onClose}>
      <h1 className="mb-4 text-xl md:text-2xl font-bold text-muted-foreground">Add Amenity</h1>
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
          loadingText="Adding..."
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Amenity
        </FormButton>
      </form>
    </Modal>
  );
};

export default AmenitiesModal;
