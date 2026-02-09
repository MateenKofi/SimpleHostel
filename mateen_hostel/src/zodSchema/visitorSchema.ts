import { z } from "zod";

// Schema to create a new visitor
export const visitorSchema = z.object({
  name: z
    .string({ required_error: "Visitor's name is required" })
    .trim()
    .min(1, { message: "Visitor's name can't be empty" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email can't be empty" }),

  phone: z
    .string({ required_error: "Phone number is required" })
    .min(1, { message: "Phone number can't be empty" }),

  residentId: z
    .string({ required_error: "Resident ID is required" })
    .min(1, { message: "Resident ID can't be empty" }),
});

// Schema for updating a visitor (all fields are optional)
export const updateVisitorSchema = z.object({
  name: z
    .string({ required_error: "Visitor's name is required" })
    .trim()
    .min(1, { message: "Visitor's name can't be empty" })
    .optional(),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email can't be empty" })
    .optional(),

  phone: z
    .string({ required_error: "Phone number is required" })
    .min(1, { message: "Phone number can't be empty" })
    .optional(),
});

// Types to infer the data structures
export type VisitorRequestDto = z.infer<typeof visitorSchema>;
export type UpdateVisitorRequestDto = z.infer<typeof updateVisitorSchema>;
