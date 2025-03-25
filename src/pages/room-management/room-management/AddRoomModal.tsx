import { useState, useEffect } from "react";
import Modal from "../../../components/Modal";
import { useForm } from "react-hook-form";
import type { Room } from "../../../helper/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import ImageUpload from "../../../components/ImageUpload";
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
      const response = await axios.get(`/api/amenities/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

      // images.forEach((image, index) => {
      //   formData.append(`photos`, image);
      // });
      
      images.forEach((image) => {
        console.log('image from append image',image)
        formData.append("photos", image);
      });

      const response = await axios.post(`/api/rooms/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Room added successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      reset();
      setImages([]);
      onClose();
    },
    //handle different instances of errors
    onError: (error: unknown) => {
      let errorMessage 
      if (error instanceof AxiosError) {

        errorMessage=error.response?.data?.message || "Failed to add room";
      } else {
        errorMessage= (error as Error).message || "Failed to add room";
      }
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
    setImages([]);}

  return (
    <Modal modalId="add_room_modal" onClose={handleClose} size="large">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Add New Room</h2>
          <p className="text-sm text-gray-500">
            Fill in the details below to add a new room
          </p>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label htmlFor="images" className="text-sm font-medium">
            Images
          </label>
          <ImageUpload onImagesChange={handleImagesChange} />
        </div>

        {/* Rest of the form fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Room Number */}
          <div className="flex flex-col gap-1">
            <label htmlFor="number" className="text-sm font-medium">
              Room Number*
            </label>
            <input
              {...register("roomNumber", {
                required: "Room number is required",
              })}
              type="text"
              id="number"
              placeholder="e.g., A101"
              className="border rounded-md p-2"
            />
            {errors.roomNumber && (
              <span className="text-red-500 text-sm">
                {errors.roomNumber.message}
              </span>
            )}
          </div>

          {/* Block */}
          <div className="flex flex-col gap-1">
            <label htmlFor="block" className="text-sm font-medium">
              Block
            </label>
            <input
              {...register("block", { required: "Block is required" })}
              type="text"
              id="block"
              placeholder="e.g., A"
              className="border rounded-md p-2"
            />
            {errors.block && (
              <span className="text-red-500 text-sm">
                {errors.block.message}
              </span>
            )}
          </div>

          {/* Floor */}
          <div className="flex flex-col gap-1">
            <label htmlFor="floor" className="text-sm font-medium">
              Floor
            </label>
            <input
              {...register("floor", {
                required: "Floor is required",
              })}
              type="number"
              id="floor"
              className="border rounded-md p-2"
            />
            {errors.floor && (
              <span className="text-red-500 text-sm">
                {errors.floor.message}
              </span>
            )}
          </div>

          {/* Room Type */}
          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="text-sm font-medium">
              Room Type*
            </label>
            <select
              {...register("roomType", { required: "Room type is required" })}
              id="type"
              className="border rounded-md p-2 "
            >
              <option value="">-- Select Room Type --</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
              <option value="quad">Quad</option>
            </select>
            {errors.roomType && (
              <span className="text-red-500 text-sm">
                {errors.roomType.message}
              </span>
            )}
          </div>

          {/* Max Occupancy (Read-only) */}
          <div className="flex flex-col gap-1">
            <label htmlFor="maxOccupancy" className="text-sm font-medium">
              Maximum Occupancy
            </label>
            <input
              {...register("maxOccupancy")}
              type="number"
              id="maxOccupancy"
              className="border rounded-md p-2 bg-gray-100"
              readOnly
            />
          </div>

          {/* Base Price */}
          <div className="flex flex-col gap-1">
            <label htmlFor="basePrice" className="text-sm font-medium">
              Base Price
            </label>
            <input
              {...register("basePrice", { required: "Base price is required" })}
              type="number"
              id="basePrice"
              className="border rounded-md p-2"
              step="0.01"
            />
            {errors.basePrice && (
              <span className="text-red-500 text-sm">
                {errors.basePrice.message}
              </span>
            )}
          </div>
        </div>

             {/* Gender */}
        <div className="flex flex-col gap-1">
          <label htmlFor="gender" className="text-sm font-medium">
            Gender*
          </label>
          <select
            {...register("gender")}
            id="gender"
            className="border rounded-md p-2"
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
          <label htmlFor="status" className="text-sm font-medium">
            Status*
          </label>
          <select
            {...register("status")}
            id="status"
            className="border rounded-md p-2"
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
          <label className="text-sm font-medium">Amenities</label>
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
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={3}
            className="border rounded-md p-2"
            placeholder="Additional details about the room..."
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex justify-center items-center px-4 py-2 bg-black text-white rounded-md"
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