import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAmenityStore } from '../../../stores/amenityStore';
import Modal from '../../../components/Modal';
import { Amenity } from '../../../types/types';

interface AmenitiesModalProps {
  onClose: () => void;
}

type AmenityFormData = Amenity
 

const AmenitiesModal = ({ onClose }: AmenitiesModalProps) => {
  const { amenities, addAmenity, removeAmenity } = useAmenityStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AmenityFormData>();

  const onSubmit: SubmitHandler<AmenityFormData> = (data) => {
    if (!data.name.trim()) {
      toast.error('Please enter an amenity name');
      return;
    }
    if (data.price < 0) {
      toast.error('Price cannot be negative');
      return;
    }
    addAmenity({
      name: data.name.trim(),
      price: data.price,
    });
    reset();
    toast.success('Amenity added successfully');
  };

  return (
    <Modal modalId='amenities_modal' onClose={onClose}>
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
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </form>
      <div className="space-y-2">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
            <div>
              <span className="mr-2">{amenity.name}</span>
              <span className="text-gray-600">${amenity.price.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                removeAmenity(amenity);
                toast.success('Amenity removed successfully');
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AmenitiesModal;