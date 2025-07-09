import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useForm } from "react-hook-form";
import type { Amenity, Room } from "@/helper/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import ImageUpload from "@/components/ImageUpload";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";


type RoomForm = Room & {
  images: File[];
};

type EditRoomModalProps = {
  onClose: () => void;
  formdata: Room;
};

const ROOM_STATUS = ["Available", "Maintenance", "Occupied"] as const;

const ROOM_TYPE_CAPACITY: Record<string, number> = {
  single: 1,
  double: 2,
  suit: 3,
  quard: 4,
};

const EditRoomModal = ({ onClose, formdata }: EditRoomModalProps) => {
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
  const [defaultImages, setDefaultImages] = useState<string[]>([]);
  const hostelId = localStorage.getItem("hostelId");
  const [imageUploadKey, setImageUploadKey] = useState(0);

  // Called when new images are uploaded
  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages || []);
  };

  // Remove a default image from the UI
  const handleRemoveDefaultImage = (index: number) => {
    setDefaultImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Fetch amenities for the hostel
  const {
    data: amenitiesData,
    isLoading: isAmenitiesLoading,
    isError: isAmenitiesError,
  } = useQuery<{ data: { id: string; name: string; price: number }[] }>({
    queryKey: ["amenities"],
    queryFn: async () => {
      const response = await axios.get(`/api/amenities/hostel/${hostelId}`);
      return response.data;
    },
  });

  const queryClient = useQueryClient();

  // Mutation to update the room
  const mutation = useMutation({
    mutationFn: async (data: RoomForm) => {
      const formData = new FormData();
      // formData.append("hostel", hostelId || "");
      formData.append("number", data.roomNumber);
      formData.append("block", data.block || "");
      formData.append("floor", data.floor?.toString() || "");
      formData.append("type", data.roomType.toUpperCase());
      formData.append("maxCap", data.maxOccupancy.toString());
      formData.append("price", data.basePrice.toString());
      formData.append("description", data.description || "");
      formData.append("status", data.status.toUpperCase());

      // Append each selected amenity ID
      if (Array.isArray(data.amenities)) {
        data.amenities.forEach((amenityId) => {
          formData.append("addAmenitiesIds[]", amenityId);
        });
      }
      // // Append each new image file
      images.forEach((image) => {
        console.log("Appending image:", image.name);
        formData.append("photos", image);
      });

      const response = await axios.put(`/api/rooms/updateall/${formdata.id}`, formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Room updated successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      reset();
      setImages([]);
      onClose();
    },
    onError: (error: AxiosError<{message:string}>) => {
      const errorMessage = error.response?.data?.message || "Failed to update room";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: RoomForm) => {
    mutation.mutate(data);
  };

  // Update maxOccupancy when roomType changes
  const roomType = watch("roomType");
  useEffect(() => {
    if (roomType) {
      setValue("maxOccupancy", ROOM_TYPE_CAPACITY[roomType]);
    }
  }, [roomType, setValue]);

  // Initialize form values and default images/amenities from formdata
  useEffect(() => {
    if (formdata) {
      setValue("roomNumber", formdata?.number);
      setValue("block", formdata?.block);
      setValue("floor", parseInt(formdata?.floor?.toString() || "0"));
      setValue("type", formdata?.type?.toLowerCase() as "single" | "double" | "suit" | "quard");
      setValue("maxOccupancy", formdata?.maxCap);
      setValue("basePrice", formdata?.price);
      setValue("description", formdata?.description);
      setValue("status", formdata?.status?.toLowerCase() as 'AVAILABLE' | 'MANTENANCE' | 'OCCUPIED');

      // Set default images from room images array
      const imageUrls = (formdata?.RoomImage ?? []).map((img: { imageUrl: string }) => img.imageUrl);
      setDefaultImages(imageUrls);

      // Use either formdata.amenities or formdata.Amenities for default selection
      const selectedAmenityIds = formdata?.amenities
        ? formdata.amenities.map((a: { id: string } | string) => typeof a === "string" ? a : a.id)
        : formdata.Amenities?.map((amenity: Amenity) => amenity.id || "") || [];
      setValue("amenities", selectedAmenityIds);
    }
  }, [formdata, setValue]);

  const handleClose = () => {
    onClose();
    reset();
    setImages([]);
    setImageUploadKey((prevKey) => prevKey + 1);
  };

  return (
    <Modal modalId="editroom_modal" onClose={handleClose} size="large">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-500">Update Room</h2>
          <p className="text-sm text-gray-500">
            Update the details below to modify the room information
          </p>
        </div>

        <ImageUpload
          key={imageUploadKey}
          onImagesChange={handleImagesChange}
          defaultImages={defaultImages}
          onRemoveDefaultImage={handleRemoveDefaultImage}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Room Number */}
          <div className="flex flex-col gap-1">
            <label htmlFor="number" className="text-sm font-medium text-gray-500">
              Room Number*
            </label>
            <input
              {...register("roomNumber", { required: "Room number is required" })}
              type="text"
              id="number"
              placeholder="e.g., A101"
              className="p-2 border rounded-md"
            />
            {errors.roomNumber && (
              <span className="text-sm text-red-500">{errors.roomNumber.message}</span>
            )}
          </div>

          {/* Block */}
          <div className="flex flex-col gap-1">
            <label htmlFor="block" className="text-sm font-medium text-gray-500">
              Block*
            </label>
            <input
              {...register("block", { required: "Block is required" })}
              type="text"
              id="block"
              placeholder="e.g., A"
              className="p-2 border rounded-md"
            />
            {errors.block && <span className="text-sm text-red-500">{errors.block.message}</span>}
          </div>

          {/* Floor */}
          <div className="flex flex-col gap-1">
            <label htmlFor="floor" className="text-sm font-medium text-gray-500">
              Floor*
            </label>
            <input
              {...register("floor", {
                required: "Floor is required",
                min: { value: 1, message: "Floor must be at least 1" },
              })}
              type="number"
              id="floor"
              className="p-2 border rounded-md"
            />
            {errors.floor && <span className="text-sm text-red-500">{errors.floor.message}</span>}
          </div>

          {/* Room Type */}
          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="text-sm font-medium text-gray-500">
              Room Type*
            </label>
            <select
              {...register("roomType", { required: "Room type is required" })}
              id="type"
              className="p-2 border rounded-md"
            >
              <option value="">Select Room Type</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suit">Suit</option>
              <option value="quard">Quard</option>
            </select>
            {errors.roomType && (
              <span className="text-sm text-red-500">{errors.roomType.message}</span>
            )}
          </div>

          {/* Maximum Occupancy (Read-only) */}
          <div className="flex flex-col gap-1">
            <label htmlFor="maxOccupancy" className="text-sm font-medium text-gray-500">
              Maximum Occupancy
            </label>
            <input
              {...register("maxOccupancy")}
              type="number"
              id="maxOccupancy"
              className="p-2 border rounded-md "
              readOnly
            />
          </div>

          {/* Base Price */}
          <div className="flex flex-col gap-1">
            <label htmlFor="basePrice" className="text-sm font-medium text-gray-500">
              Base Price*
            </label>
            <input
              {...register("basePrice", { required: "Base price is required" })}
              type="number"
              id="basePrice"
              className="p-2 border rounded-md"
              step="0.01"
            />
            {errors.basePrice && (
              <span className="text-sm text-red-500">{errors.basePrice.message}</span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-gray-500">
            Status*
          </label>
          <select
            {...register("status", { required: "Status is required" })}
            id="status"
            className="p-2 border rounded-md"
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
          <label className="text-sm font-medium text-gray-500">Amenities</label>
          {isAmenitiesLoading && <Loader className="w-4 h-4 animate-spin" />}
          {isAmenitiesError && (
            <span className="text-sm text-red-500">Failed to load amenities</span>
          )}
          {!isAmenitiesLoading && !isAmenitiesError && amenitiesData?.data?.length === 0 && (
            <span className="text-sm text-gray-500">No amenities available</span>
          )}
          
          {/* Amenities Checkboxes */}
          <div className="flex flex-wrap gap-2">
            {amenitiesData?.data?.map((amenity) => {
              const currentAmenities: string[] = watch("amenities") || [];
              const isSelected = currentAmenities.includes(amenity.id);
              return (
                <label
                  key={amenity.id}
                  className={`w-fit cursor-pointer px-4 py-2 rounded-full border transition-colors shadow ${
                    isSelected
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={amenity.id}
                    {...register("amenities")}
                    className="hidden"
                    checked={isSelected}
                    onChange={(e) => {
                      let updatedAmenities = [...currentAmenities];
                      if (e.target.checked) {
                        updatedAmenities.push(amenity.id);
                      } else {
                        updatedAmenities = updatedAmenities.filter((id) => id !== amenity.id);
                      }
                      setValue("amenities", updatedAmenities);
                    }}
                  />
                  {amenity.name}
                </label>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-500">
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={handleClose} className="px-4 py-2 text-white bg-red-500 border rounded-md">
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2 text-white bg-black rounded-md"
          >
            {mutation.isPending ? <Loader className="w-4 h-4 animate-spin" /> : "Update Room"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRoomModal;
