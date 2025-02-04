import { useState, useEffect } from "react";
import Modal from "../../../components/Modal";
import { useForm } from "react-hook-form";
import type { Room } from "../../../types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ImageUpload from "../../../components/ImageUpload";
import { Loader } from "lucide-react";

type RoomForm = Room & {
  images: File[];
};

const ROOM_STATUS = ["Available", "Maintenance", "Occupied"] as const;

const ROOM_TYPE_CAPACITY = {
  single: 1,
  double: 2,
  suit: 3,
  quard: 4,
};

const EditRoomModal = ({ onClose, formdata }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RoomForm>({
    defaultValues: {
      images: [],
      amenities: [],
    },
  });

  console.log('formdata',formdata)

  const [images, setImages] = useState<File[]>([]);
  const [defaultImages, setDefaultImages] = useState<string[]>([]);
  const hostelId = localStorage.getItem("hostelId");

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
    console.log("images", newImages);
  };

  const {
    data: Amenities,
    isLoading,
    isError,
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

      if (Array.isArray(data.amenities)) {
        data.amenities.forEach((amenityId, index) => {
          formData.append(`amenitiesIds[]`, amenityId);
        });
      }

      images.forEach((image) => {
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
      onClose();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to add room";
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
      setValue("maxOccupancy", ROOM_TYPE_CAPACITY[roomType]);
    }
  }, [roomType, setValue]);

  useEffect(() => {
    if (formdata) {
      setValue("roomNumber", formdata.number);
      setValue("block", formdata.block);
      setValue("floor", parseInt(formdata.floor));
      setValue("roomType", formdata.type.toLowerCase());
      setValue("maxOccupancy", formdata.maxCap);
      setValue("basePrice", formdata.price);
      setValue("description", formdata.description);
      setValue("status", formdata.status.toLowerCase());
      const imageUrls = formdata.RoomImage.map((img: any) => img.imageUrl);
      setDefaultImages(imageUrls);
      setValue("images", imageUrls);
    }
  }, [formdata, setValue]);

  return (
    <Modal modalId="editroom_modal" onClose={onClose} size="large">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Update Room</h2>
          <p className="text-sm text-gray-500">
            Update the details below to modify the room information
          </p>
        </div>

        <ImageUpload onImagesChange={handleImagesChange} defaultImages={defaultImages} />
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
                min: { value: 1, message: "Floor must be at least 1" },
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
              <option value="">Select Room Type</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suit">Suit</option>
              <option value="quard">Quard</option>
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

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium">
            Status*
          </label>
          <select
            {...register("status")}
            id="status"
            className="border rounded-md p-2"
            defaultValue={formdata?.status.toLowerCase()}
          >
            {ROOM_STATUS.map((status) => (
              <option key={status} value={status.toLowerCase()}>
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
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex justify-center items-center px-4 py-2 bg-black text-white rounded-md"
          >
            {mutation.isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              "Update Room"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRoomModal;
