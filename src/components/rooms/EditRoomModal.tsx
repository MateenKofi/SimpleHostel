import { useState, useEffect } from "react";
import React from "react";
import Modal from "@/components/Modal";
import { openModals, listeners } from "@/components/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema, ROOM_TYPE_CAPACITY, ROOM_STATUS } from "@/schemas/roomSchema";
import type { RoomFormData } from "@/schemas/roomSchema";
import type { Amenity, Room } from "@/helper/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoom } from "@/api/rooms";
import { getHostelAmenities } from "@/api/amenities";
import { AxiosError } from "axios";
import ImageUpload from "@/components/ImageUpload";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type RoomForm = Omit<Room, "amenities"> & {
  images: File[];
  amenities: string[];
};

type EditRoomModalProps = {
  onClose: () => void;
  formdata: Room;
};

const EditRoomModal = ({ onClose, formdata }: EditRoomModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      images: [],
      amenities: [],
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [defaultImages, setDefaultImages] = useState<string[]>([]);
  const hostelId = localStorage.getItem("hostelId");
  const [imageUploadKey, setImageUploadKey] = useState(0);
  const [modalOpenKey, setModalOpenKey] = useState(0);

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
    isLoading: amenitiesLoading,
    isError: amenitiesError,
  } = useQuery<{ data: { id: string; name: string; price: number }[] }>({
    queryKey: ["amenities"],
    queryFn: async () => {
      if (!hostelId) return { data: [] };
      return await getHostelAmenities(hostelId);
    },
  });

  const queryClient = useQueryClient();

  // Mutation to update the room
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

      // Append each selected amenity ID
      if (Array.isArray(data.amenities)) {
        data.amenities.forEach((amenityId) => {
          formData.append("addAmenitiesIds[]", amenityId);
        });
      }
      // // Append each new image file
      images.forEach((image) => {
        formData.append("photos", image);
      });

      return await updateRoom(formdata.id, formData);
    },
    onSuccess: () => {
      toast.success("Room updated successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      reset();
      setImages([]);
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || "Failed to update room";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: RoomFormData) => {
    mutation.mutate(data as RoomForm);
  };

  // Update maxOccupancy when type changes
  const type = watch("type");
  useEffect(() => {
    if (type) {
      setValue("maxOccupancy", ROOM_TYPE_CAPACITY[type]);
    }
  }, [type, setValue]);

  // Track modal open state to re-initialize form when modal opens
  const wasOpenRef = React.useRef(false);
  useEffect(() => {
    const checkModalState = () => {
      const isNowOpen = openModals.has("editroom_modal");
      // Only increment key when transitioning from closed to open
      if (isNowOpen && !wasOpenRef.current) {
        setModalOpenKey(prev => prev + 1);
      }
      wasOpenRef.current = isNowOpen;
    };

    // Register listener
    listeners.add(checkModalState);
    // Initial check
    checkModalState();

    return () => {
      listeners.delete(checkModalState);
    };
  }, []);

  // Initialize form values and default images/amenities from formdata
  useEffect(() => {
    if (formdata) {
      setValue("roomNumber", formdata?.number);
      setValue("block", formdata?.block);
      setValue("floor", parseInt(formdata?.floor?.toString() || "0"));
      setValue("type", (formdata?.type?.toLowerCase() || "single") as "single" | "double" | "suite" | "quad");
      setValue("maxOccupancy", formdata?.maxCap);
      setValue("basePrice", formdata?.price);
      setValue("description", formdata?.description ?? undefined);
      setValue("status", (formdata?.status?.toLowerCase() || "available") as 'available' | 'maintenance' | 'occupied');
      setValue("gender", (formdata?.gender?.charAt(0).toUpperCase() + formdata?.gender?.slice(1).toLowerCase() || "Male") as "Male" | "Female" | "Mix");

      // Set default images from room images array - API returns roomImages (camelCase)
      const imageUrls = (formdata?.roomImages ?? formdata?.RoomImage ?? []).map((img: { imageUrl: string }) => img.imageUrl);
      setDefaultImages(imageUrls);

      // Use either formdata.amenities or formdata.Amenities for default selection
      const selectedAmenityIds = formdata?.amenities
        ? formdata.amenities.map((a: { id: string } | string) => typeof a === "string" ? a : a.id)
        : formdata.Amenities?.map((amenity: Amenity) => amenity.id || "") || [];
      setValue("amenities", selectedAmenityIds);
    }
  }, [formdata?.id, modalOpenKey, setValue]);

  const handleClose = () => {
    onClose();
    reset();
    setImages([]);
    setImageUploadKey((prevKey) => prevKey + 1);
  };

  const selectedAmenities = watch("amenities") || [];

  return (
    <Modal modalId="editroom_modal" onClose={handleClose} size="large">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Update Room</h2>
          <p className="text-sm text-muted-foreground">
            Update the details below to modify the room information
          </p>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <Label>Images</Label>
          <ImageUpload
            key={imageUploadKey}
            onImagesChange={handleImagesChange}
            defaultImages={defaultImages}
            onRemoveDefaultImage={handleRemoveDefaultImage}
          />
          <p className="text-sm text-muted-foreground italic">
            Add new images or remove existing ones
          </p>
        </div>

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
            <Label htmlFor="block">Block</Label>
            <Input
              id="block"
              placeholder="e.g., A"
              aria-invalid={errors.block ? "true" : "false"}
              aria-describedby={errors.block ? "block-error" : undefined}
              {...register("block")}
            />
            {errors.block && (
              <p id="block-error" className="text-destructive text-sm" role="alert">
                {errors.block.message}
              </p>
            )}
          </div>

          {/* Floor */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              type="number"
              aria-invalid={errors.floor ? "true" : "false"}
              aria-describedby={errors.floor ? "floor-error" : undefined}
              {...register("floor")}
            />
            {errors.floor && (
              <p id="floor-error" className="text-destructive text-sm" role="alert">
                {errors.floor.message}
              </p>
            )}
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
              <option value="">Select Room Type</option>
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

          {/* Maximum Occupancy (Read-only) */}
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

          {/* Amenities Checkboxes */}
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
                    checked={isSelected}
                    onChange={(e) => {
                      let updatedAmenities = [...selectedAmenities];
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="Additional details about the room..."
            {...register("description")}
          />
        </div>

        {/* Action Buttons */}
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
            {mutation.isPending ? "Saving..." : "Update Room"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRoomModal;
