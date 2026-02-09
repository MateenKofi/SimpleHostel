import { z } from "zod";
// Schema to create a new hostel
export const hostelSchema = z.object({
  name: z
    .string({ required_error: "The hostel name is required" })
    .trim()
    .min(1, { message: "Hostel name can't be empty" }),

  description: z
    .string({ required_error: "Description is needed" })
    .trim()
    .min(1, { message: "Description can't be empty" })
    .optional(),

  address: z
    .string({ required_error: "The address is required" })
    .trim()
    .min(1, { message: "Address can't be empty" }),

  location: z
    .string({ required_error: "Location is required" })
    .trim()
    .min(1, { message: "Location can't be empty" }),

  manager: z
    .string({ required_error: "Manager's name is required" })
    .trim()
    .min(1, { message: "Manager's name can't be empty" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email can't be empty" }),

  phone: z
    .string({ required_error: "Phone number is required" })
    .min(1, { message: "Phone number can't be empty" }),

  allowPartialPayment: z.boolean().optional().default(false),
  partialPaymentPercentage: z.number().min(0).max(100).optional().default(50),
});

// Schema for updating a hostel (all fields are optional)
export const updateHostelSchema = z.object({
  name: z
    .string({ required_error: "Hostel name is required" })
    .trim()
    .min(1, { message: "Hostel name can't be empty" })
    .optional(),

  description: z
    .string({ required_error: "Description is needed" })
    .trim()
    .min(1, { message: "Description can't be empty" })
    .optional(),

  address: z
    .string({ required_error: "The address is required" })
    .trim()
    .min(1, { message: "Address can't be empty" })
    .optional(),

  location: z
    .string({ required_error: "Location is required" })
    .trim()
    .min(1, { message: "Location can't be empty" })
    .optional(),

  manager: z
    .string({ required_error: "Manager's name is required" })
    .trim()
    .min(1, { message: "Manager's name can't be empty" })
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

  allowPartialPayment: z.boolean().optional(),
  partialPaymentPercentage: z.number().min(0).max(100).optional(),
});

export const paymentSettingsSchema = z.object({
  allowPartialPayment: z.boolean({ required_error: "allowPartialPayment is required" }),
  partialPaymentPercentage: z.number().min(0).max(100).optional().default(50),
});

// Types to infer the data structures
export type HostelRequestDto = z.infer<typeof hostelSchema>;
export type UpdateHostelRequestDto = z.infer<typeof updateHostelSchema>;
export type PaymentSettingsDto = z.infer<typeof paymentSettingsSchema>;
