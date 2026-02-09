"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.userSchema = exports.userRoleEnum = void 0;
const zod_1 = require("zod");
// Enum for user roles
exports.userRoleEnum = zod_1.z.enum(["admin", "super_admin", "resident", "staff"]);
// Schema to create a new user
exports.userSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, { message: "Name can't be empty" }),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email must be a valid email address" })
        .min(1, { message: "Email can't be empty" }),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" }),
    phoneNumber: zod_1.z
        .string({ required_error: "Phone number is required" })
        .min(1, { message: "Phone number can't be empty" }),
    role: exports.userRoleEnum, // Admin or Staff
});
// Schema for updating a user (all fields are optional)
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, { message: "Name can't be empty" })
        .optional(),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email must be a valid email address" })
        .min(1, { message: "Email can't be empty" })
        .optional(),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" })
        .optional(),
    phoneNumber: zod_1.z
        .string({ required_error: "Phone number is required" })
        .min(1, { message: "Phone number can't be empty" })
        .optional(),
    role: exports.userRoleEnum.optional(), // Admin or Staff
});
