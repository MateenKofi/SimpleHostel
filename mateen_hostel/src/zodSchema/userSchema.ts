import { z } from "zod";

// Enum for user roles
export const userRoleEnum = z.enum(["admin", "super_admin", "resident", "staff"]);

// Schema to create a new user
export const userSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name can't be empty" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email can't be empty" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),

  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .min(1, { message: "Phone number can't be empty" }),

  role: userRoleEnum, // Admin or Staff
});

// Schema for updating a user (all fields are optional)
export const updateUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name can't be empty" })
    .optional(),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email can't be empty" })
    .optional(),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),

  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .min(1, { message: "Phone number can't be empty" })
    .optional(),

  role: userRoleEnum.optional(), // Admin or Staff
});

// Types to infer the data structures
export type UserRequestDto = z.infer<typeof userSchema>;
export type UpdateUserRequestDto = z.infer<typeof updateUserSchema>;
