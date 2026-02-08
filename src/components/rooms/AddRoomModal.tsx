import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema, ROOM_TYPE_CAPACITY, ROOM_STATUS, GENDER_OPTIONS } from "@/schemas/roomSchema";
import type { RoomFormData } from "@/schemas/roomSchema";
import type { Room } from "../../helper/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addRoom } from "@/api/rooms";
import { getHostelAmenities } from "@/api/amenities";
import ImageUpload from "@/components/ImageUpload";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import type { ApiError } from "@/types/dtos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type RoomForm = Omit<Room, "amenities"> & {
  images: File[];
  amenities: string[];
  type: Room["type"];
};

const AddRoomModal = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    setError,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      images: [],
      amenities: [],
      type: undefined,
      status: "available",
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [imageUploadKey, setImageUploadKey] = useState(0);
  const hostelId = localStorage.getItem("hostelId");

  // handle images change
  const handleImagesChange = (newImages: File[]) => {
    if (newImages.length === 0) {
      setError("images", { message: "Please upload at least one image" });
      setImages([]);
    } else {
      const imageArray = Array.from(newImages).map((image) => {
        const file = new File([image], image.name, { type: image.type });
        return file;
      });
      setImages(imageArray);
      // Clear error if images are now valid
      if (errors.images) {
        setError("images", { message: undefined });
      }
    }
  };

  const {
    data: amenitiesData,
    isLoading: amenitiesLoading,
    isError: amenitiesError,
  } = useQuery<{
    data: { id: string; name: string; price: number }[];
  }>({
    queryKey: ["amenities"],
    queryFn: async () => {
      if (!hostelId) return { data: [] };
      return await getHostelAmenities(hostelId);
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
      formData.append("type", data.type.toUpperCase());
      formData.append("maxCap", data.maxOccupancy.toString());
      formData.append("price", data.basePrice.toString());
      formData.append("description", data.description || "");
      formData.append("status", data.status.toUpperCase());
      formData.append("gender", data.gender);

      if (Array.isArray(data.amenities)) {
        data.amenities.forEach((amenityId) => {
          formData.append(`amenitiesIds[]`, String(amenityId));
        });
      }

      images.forEach((image) => {
        formData.append("photos", image);
      });

      try {
        const responseData = await addRoom(formData);
        toast.success("Room added successfully");
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
        reset();
        setImages([]);
        onClose();
        return responseData;
      } catch (error: unknown) {
        const err = error as ApiError;
        toast.error(err.response?.data?.message || "An error occurred");
        throw error;
      }
    },
  });

  const onSubmit = (data: RoomFormData) => {
    if (images.length === 0) {
      setError("images", { message: "Room images are required" });
      return;
    }
    mutation.mutate(data as RoomForm);
  };

  // Watch the type field and update maxOccupancy accordingly
  const roomType = watch("type");
  useEffect(() => {
    if (roomType) {
      setValue(
        "maxOccupancy",
        ROOM_TYPE_CAPACITY[roomType]
      );
    }
  }, [roomType, setValue]);

  const handleClose = () => {
    onClose();
    reset();
    setImages([]);
    setImageUploadKey((prevKey) => prevKey + 1);
  };

  const selectedAmenities = watch("amenities") || [];

  return (
    <Modal modalId="add_room_modal" onClose={handleClose} size="large">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Add New Room</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to add a new room
          </p>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="images">Images</Label>
          <ImageUpload
            key={imageUploadKey}
            onImagesChange={handleImagesChange}
          />
          {errors.images && (
            <p className="text-destructive text-sm" role="alert">
              {errors.images.message}
            </p>
          )}
          <p className="text-sm text-muted-foreground italic">
            You can only upload a max of 3 images
          </p>
        </div>

        {/* Rest of the form fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Room Number */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="roomNumber">Room Number</Label>
            <Input
              id="roomNumber"
              placeholder="e.g., A101"
              aria-invalid={errors.roomNumber ? "true" : "false"}
              aria-describedby={errors.roomNumber ? "roomNumber-error" : undefined}
              {...register("roomNumber")}
            />
            {errors.roomNumber && (
              <p id="roomNumber-error" className="text-destructive text-sm" role="alert">
                {errors.roomNumber.message}
              </p>
            )}
          </div>

          {/* Block */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="block">Block (optional)</Label>
            <Input
              id="block"
              placeholder="e.g., A"
              {...register("block")}
            />
          </div>

          {/* Floor */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="floor">Floor (optional)</Label>
            <Input
              id="floor"
              type="number"
              {...register("floor")}
            />
          </div>

          {/* Room Type */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Room Type</Label>
            <select
              id="type"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-invalid={errors.type ? "true" : "false"}
              aria-describedby={errors.type ? "type-error" : undefined}
              {...register("type")}
            >
              <option value="">-- Select Room Type --</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
              <option value="quad">Quad</option>
            </select>
            {errors.type && (
              <p id="type-error" className="text-destructive text-sm" role="alert">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Max Occupancy (Read-only) */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="maxOccupancy">Maximum Occupancy</Label>
            <Input
              id="maxOccupancy"
              type="number"
              readOnly
              className="bg-muted cursor-not-allowed"
              {...register("maxOccupancy")}
            />
          </div>

          {/* Base Price */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="basePrice">Base Price</Label>
            <Input
              id="basePrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              aria-invalid={errors.basePrice ? "true" : "false"}
              aria-describedby={errors.basePrice ? "basePrice-error" : undefined}
              {...register("basePrice")}
            />
            {errors.basePrice && (
              <p id="basePrice-error" className="text-destructive text-sm" role="alert">
                {errors.basePrice.message}
              </p>
            )}
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-invalid={errors.gender ? "true" : "false"}
            aria-describedby={errors.gender ? "gender-error" : undefined}
            {...register("gender")}
          >
            <option value="">-- Select Gender --</option>
            {GENDER_OPTIONS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p id="gender-error" className="text-destructive text-sm" role="alert">
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-invalid={errors.status ? "true" : "false"}
            aria-describedby={errors.status ? "status-error" : undefined}
            {...register("status")}
          >
            <option value="">-- Select Status --</option>
            {ROOM_STATUS.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          {errors.status && (
            <p id="status-error" className="text-destructive text-sm" role="alert">
              {errors.status.message}
            </p>
          )}
        </div>

        {/* Amenities */}
        <div className="flex flex-col gap-2">
          <Label>Amenities</Label>
          {amenitiesLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading amenities...</span>
            </div>
          )}
          {amenitiesError && (
            <p className="text-destructive text-sm">Failed to load amenities</p>
          )}
          {!amenitiesLoading && !amenitiesError && amenitiesData?.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">No amenities available</p>
          )}
          <div className="flex flex-wrap gap-2">
            {amenitiesData?.data?.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity.id);
              return (
                <label
                  key={amenity.id}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors shadow-sm",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                  )}
                >
                  <input
                    type="checkbox"
                    value={amenity.id}
                    {...register("amenities")}
                    className="hidden"
                  />
                  {amenity.name}
                </label>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="Additional details about the room..."
            {...register("description")}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader className="w-4 h-4 mr-2 animate-spin" />}
            {mutation.isPending ? "Adding..." : "Add Room"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRoomModal;
