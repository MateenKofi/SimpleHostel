import { z } from "zod";

export const  ResidentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  studentId: z.string().min(1, {
    message: "Student ID is required.",
  }),
  course: z.string().min(1, {
    message: "Course is required.",
  }),
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
});