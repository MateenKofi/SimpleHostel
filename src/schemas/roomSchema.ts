import { z } from "zod";

/**
 * Zod schema for room form validation
 * Used in both AddRoomModal and EditRoomModal
 */
export const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  block: z.string().optional(),
  floor: z.coerce.number().min(0, "Floor must be a positive number").optional(),
  type: z.enum(["single", "double", "suite", "quad"], {
    required_error: "Room type is required",
  }),
  maxOccupancy: z.coerce.number().min(1, "Maximum occupancy is required"),
  basePrice: z.coerce.number().min(0, "Price must be positive"),
  status: z.enum(["available", "maintenance", "occupied"], {
    required_error: "Status is required",
  }),
  gender: z.enum(["Male", "Female", "Mix"], {
    required_error: "Gender is required",
  }),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.any()).optional(),
});

export type RoomFormData = z.infer<typeof roomSchema>;

/**
 * Room type to capacity mapping
 */
export const ROOM_TYPE_CAPACITY: Record<string, number> = {
  single: 1,
  double: 2,
  suite: 3,
  quad: 4,
};

/**
 * Available room statuses
 */
export const ROOM_STATUS = ["available", "maintenance", "occupied"] as const;

/**
 * Available gender options
 */
export const GENDER_OPTIONS = ["Male", "Female", "Mix"] as const;
