import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useForm } from "react-hook-form";
import type { Room } from "../../helper/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import ImageUpload from "@/components/ImageUpload";
import { Loader } from "lucide-react";
import { toast } from "react-hot-toast";

type RoomForm = Room & {
  images: File[];
};

const ROOM_STATUS = ["Available", "Maintenance", "Occupied"] as const;
const GENDER = ["Male","Female","Mix"] as const;

const ROOM_TYPE_CAPACITY = {
  single: 1,
  double: 2,
  suite: 3,
  quad: 4,
};

const AddRoomModal = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RoomForm>({
    defaultValues: {
      images: [],
      amenities: [],
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [imageUploadKey, setImageUploadKey] = useState(0);
  const hostelId = localStorage.getItem("hostelId");

  // handle images change
  const handleImagesChange = (newImages: File[]) => {
    const imageArray = Array.from(newImages).map((image) => {
      const file = new File([image], image.name, { type: image.type });
      return file;
    });
    setImages(imageArray);
  };

  const {
    data: Amenities,
  } = useQuery<{ data: { id: string; name: string; price: number }[] }>({
    queryKey: ["amenities"],
    queryFn: async () => {
      const response = await axios.get(`/api/amenities/hostel/${hostelId}`);
      return response?.data;
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: RoomForm) => {
      const formData = new FormData();
      formData.append("hostelId", hostelId || "");
      formData.append("number", data.roomNumber);
      formData.append("block", data.block || "");
      formData.append("floor", data.floor?.toString() || "");
      formData.append("type", data.roomType.toUpperCase());
      formData.append("maxCap", data.maxOccupancy.toString());
      formData.append("price", data.basePrice.toString());
      formData.append("description", data.description || "");
      formData.append("status", data.status.toUpperCase());
      formData.append('gender',data.gender.toUpperCase());

      if (Array.isArray(data.amenities)) {
        data.amenities.forEach((amenityId) => {
          formData.append(`amenitiesIds[]`, amenityId);
        });
      }
      
      images.forEach((image) => {
        console.log('image from append image',image)
        formData.append("photos", image);
      });

      const response = await axios.post(`/api/rooms/add`, formData);

      return response.data;
    },
    onSuccess: () => {
      toast.success("Room added successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      reset();
      setImages([]);
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to Update User Details";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: RoomForm) => {
    mutation.mutate(data);
  };

  // Watch the roomType field and update maxOccupancy accordingly
  const roomType = watch("roomType");
  useEffect(() => {
    if (roomType) {
      setValue("maxOccupancy", ROOM_TYPE_CAPACITY[roomType as keyof typeof ROOM_TYPE_CAPACITY]);
    }
  }, [roomType, setValue]);
  
  const handleClose = () => {
    onClose();
    reset();
    setImages([]);
    setImageUploadKey((prevKey) => prevKey + 1);
  };

  return (
    <Modal modalId="add_room_modal" onClose={handleClose} size="large">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-500 ">Add New Room</h2>
          <p className="text-sm text-gray-500">
            Fill in the details below to add a new room
          </p>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label htmlFor="images" className="text-sm font-medium text-gray-900">
            Images
          </label>
          <ImageUpload key={imageUploadKey} onImagesChange={handleImagesChange} />
          <p className="text-sm italic font-thin text-gray-500">you can only upload a max of 5 images</p>
        </div>

        {/* Rest of the form fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Room Number */}
          <div className="flex flex-col gap-1">
            <label htmlFor="number" className="text-sm font-medium text-gray-500 ">
              Room Number*
            </label>
            <input
              {...register("roomNumber", {
                required: "Room number is required",
              })}
              type="text"
              id="number"
              placeholder="e.g., A101"
              className="p-2 border rounded-md"
            />
            {errors.roomNumber && (
              <span className="text-sm text-red-500">
                {errors.roomNumber.message}
              </span>
            )}
          </div>

          {/* Block */}
          <div className="flex flex-col gap-1">
            <label htmlFor="block" className="text-sm font-medium text-gray-500 ">
              Block
            </label>
            <input
              {...register("block", { required: "Block is required" })}
              type="text"
              id="block"
              placeholder="e.g., A"
              className="p-2 border rounded-md"
            />
            {errors.block && (
              <span className="text-sm text-red-500">
                {errors.block.message}
              </span>
            )}
          </div>

          {/* Floor */}
          <div className="flex flex-col gap-1">
            <label htmlFor="floor" className="text-sm font-medium text-gray-500 ">
              Floor
            </label>
            <input
              {...register("floor", {
                required: "Floor is required",
              })}
              type="number"
              id="floor"
              className="p-2 border rounded-md"
            />
            {errors.floor && (
              <span className="text-sm text-red-500">
                {errors.floor.message}
              </span>
            )}
          </div>

          {/* Room Type */}
          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="text-sm font-medium text-gray-500 ">
              Room Type*
            </label>
            <select
              {...register("roomType", { required: "Room type is required" })}
              id="type"
              className="p-2 border rounded-md "
            >
              <option value="">-- Select Room Type --</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
              <option value="quad">Quad</option>
            </select>
            {errors.roomType && (
              <span className="text-sm text-red-500">
                {errors.roomType.message}
              </span>
            )}
          </div>

          {/* Max Occupancy (Read-only) */}
          <div className="flex flex-col gap-1">
            <label htmlFor="maxOccupancy" className="text-sm font-medium text-gray-500 ">
              Maximum Occupancy
            </label>
            <input
              {...register("maxOccupancy")}
              type="number"
              id="maxOccupancy"
              className="p-2 border rounded-md"
              readOnly
            />
          </div>

          {/* Base Price */}
          <div className="flex flex-col gap-1">
            <label htmlFor="basePrice" className="text-sm font-medium text-gray-500 ">
              Base Price
            </label>
            <input
              {...register("basePrice", { required: "Base price is required" })}
              type="number"
              id="basePrice"
              className="p-2 border rounded-md"
              step="0.01"
            />
            {errors.basePrice && (
              <span className="text-sm text-red-500">
                {errors.basePrice.message}
              </span>
            )}
          </div>
        </div>

             {/* Gender */}
        <div className="flex flex-col gap-1">
          <label htmlFor="gender" className="text-sm font-medium text-gray-500 ">
            Gender*
          </label>
          <select
            {...register("gender")}
            id="gender"
            className="p-2 border rounded-md"
          >
            <option value="">-- select gender --</option>
            {GENDER.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-gray-500 ">
            Status*
          </label>
          <select
            {...register("status")}
            id="status"
            className="p-2 border rounded-md"
          >
            <option value="">-- Select Status --</option>
            {ROOM_STATUS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Amenities */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-500 ">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {Amenities?.data?.map((amenity) => (
              <label
                key={amenity.id}
                className={`
                  w-fit cursor-pointer px-4 py-2 rounded-full border transition-colors shadow
                  ${
                    Array.isArray(watch("amenities")) &&
                    watch("amenities").includes(amenity.id)
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <input
                  type="checkbox"
                  value={amenity.id}
                  {...register("amenities")}
                  className="hidden"
                />
                {amenity.name}
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-500 ">
            Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={3}
            className="p-2 border rounded-md"
            placeholder="Additional details about the room..."
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-white transition-colors duration-200 bg-red-500 border rounded-md hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2 text-white bg-black rounded-md"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              "Add Room"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRoomModal;