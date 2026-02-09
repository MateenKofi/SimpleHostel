import { z } from "zod";

// Enums to match Prisma schema
export const GenderEnum = z.preprocess(
  (val) => (typeof val === "string" ? val.toLowerCase() : val),
  z.enum(["male", "female", "other"])
);
export const ResidentStatusEnum = z.preprocess(
  (val) => (typeof val === "string" ? val.toLowerCase() : val),
  z.enum(["active", "checked_out", "banned"])
);

type Gender = z.infer<typeof GenderEnum>;
type ResidentStatus = z.infer<typeof ResidentStatusEnum>;

// Base schema for common resident fields
const baseResidentSchema = {
  studentId: z
    .string()
    .trim()
    .min(1, { message: "Student ID can't be empty" })
    .optional(),

  course: z
    .string()
    .trim()
    .min(1, { message: "Course can't be empty" })
    .optional(),

  roomId: z
    .string({ required_error: "Room ID is required" })
    .trim()
    .min(1, { message: "Room ID can't be empty" })
    .optional(),

  roomNumber: z
    .string({ required_error: "Room Number is required" })
    .trim()
    .optional(),

  hostelId: z
    .string({ required_error: "Hostel ID is required" })
    .trim()
    .min(1, { message: "Hostel ID can't be empty" })
    .optional(),

  gender: GenderEnum,
  status: ResidentStatusEnum.optional(),
  checkInDate: z.coerce.date().optional(),
  checkOutDate: z.coerce.date().optional(),
  emergencyContactName: z
    .string({ required_error: "Emergency contact name is required" })
    .trim()
    .min(1, { message: "Emergency contact name can't be empty" }),
  emergencyContactPhone: z
    .string({ required_error: "Emergency contact phone is required" })
    .trim()
    .min(1, { message: "Emergency contact phone can't be empty" }),
  emergencyContactRelationship: z.string().optional(),
};

// Schema for creating a new Resident
export const residentSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name can't be empty" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email can't be empty" }),

  phone: z
    .string({ required_error: "Phone number is required" })
    .min(1, { message: "Phone number can't be empty" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),

  ...baseResidentSchema,
});

// Schema for updating a Resident (all fields are optional)
export const updateResidentSchema = residentSchema.partial();

// Schema for admin adding a resident (password optional, will be generated)
export const adminResidentSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name can't be empty" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email can't be empty" }),

  phone: z
    .string({ required_error: "Phone number is required" })
    .min(1, { message: "Phone number can't be empty" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .optional(),

  ...baseResidentSchema,
});

// Types to infer the data structures
export type ResidentRequestDto = z.infer<typeof residentSchema>;
export type UpdateResidentRequestDto = z.infer<typeof updateResidentSchema>;
export type AdminResidentRequestDto = z.infer<typeof adminResidentSchema>;

export type { Gender, ResidentStatus };
