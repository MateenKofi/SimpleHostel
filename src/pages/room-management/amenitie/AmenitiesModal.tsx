import { Plus, Trash2, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import Modal from '../../../components/Modal';
import { Amenity } from '../../../types/types';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';

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
      const response = await axios.post(`/api/amenities/add`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      return response?.data;
    },
    onSuccess: () => {
      toast.success("Amenities Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      reset();
    },
    onError: (error: any) => {
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
      <h1 className="text-2xl font-bold mb-4">Add Amenity</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 p-4">
        <div className="flex gap-2">
          <input
            {...register('name', { required: 'Amenity name is required' })}
            type="text"
            placeholder="Enter amenity name"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          <input
            {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })}
            type="number"
            placeholder="Price"
            className="w-32 px-3 py-2 border rounded-md"
            min="0"
            step="0.01"
          />
          {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2"
          >
            {AddAmenitiesMutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> :
            (
              <div className='flex items-center gap-2'>
                <Plus className="w-4 h-4" />
                <span className="text-nowrap">
                Add Amenity
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

export default AmenitiesModal;
