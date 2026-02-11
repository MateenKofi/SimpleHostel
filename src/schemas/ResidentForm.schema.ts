import { z } from "zod";

// Base schema for common resident fields
const baseResidentFields = {
  name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  studentId: z.string().optional(),
  course: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  emergencyContactName: z.string().min(2, {
    message: "Emergency contact name is required.",
  }),
  emergencyContactPhone: z.string().min(10, {
    message: "Please enter a valid emergency contact phone number.",
  }),
  relationship: z.string().min(1, {
    message: "Relationship is required.",
  }),
  gender: z.string().min(1, {
    message: "Gender is required.",
  }),
};

// Schema for public self-registration (password required)
export const PublicResidentFormSchema = z.object({
  ...baseResidentFields,
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Please confirm your password.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Schema for admin registration (password optional)
export const AdminResidentFormSchema = z.object({
  ...baseResidentFields,
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).optional(),
});

// Legacy export for backward compatibility
export const ResidentFormSchema = AdminResidentFormSchema;