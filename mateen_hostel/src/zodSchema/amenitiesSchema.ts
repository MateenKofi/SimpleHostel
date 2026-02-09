import { z } from "zod";

// Schema for creating amenities
export const amenitiesSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.number().min(0, { message: "Price must be a non-negative value" }),
  hostelId: z.string({ required_error: "HOSTEL ID is required" }).cuid("Invalid hostel ID"),
});

// Schema for updating amenities
export const updateAmenitiesSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  price: z
    .number()
    .min(0, { message: "Price must be a non-negative value" })
    .optional(),
  hostelId: z.string({ required_error: "HOSTEL ID is required" }).cuid("Invalid hostel ID").optional()
});

export type amenitiesDto = z.infer<typeof amenitiesSchema>;
export type updateAmenitiesDto = z.infer<typeof updateAmenitiesSchema>;
