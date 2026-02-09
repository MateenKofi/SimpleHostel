"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminResidentSchema = exports.updateResidentSchema = exports.residentSchema = exports.ResidentStatusEnum = exports.GenderEnum = void 0;
const zod_1 = require("zod");
// Enums to match Prisma schema
exports.GenderEnum = zod_1.z.preprocess((val) => (typeof val === "string" ? val.toLowerCase() : val), zod_1.z.enum(["male", "female", "other"]));
exports.ResidentStatusEnum = zod_1.z.preprocess((val) => (typeof val === "string" ? val.toLowerCase() : val), zod_1.z.enum(["active", "checked_out", "banned"]));
// Base schema for common resident fields
const baseResidentSchema = {
    studentId: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Student ID can't be empty" })
        .optional(),
    course: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Course can't be empty" })
        .optional(),
    roomId: zod_1.z
        .string({ required_error: "Room ID is required" })
        .trim()
        .min(1, { message: "Room ID can't be empty" })
        .optional(),
    roomNumber: zod_1.z
        .string({ required_error: "Room Number is required" })
        .trim()
        .optional(),
    hostelId: zod_1.z
        .string({ required_error: "Hostel ID is required" })
        .trim()
        .min(1, { message: "Hostel ID can't be empty" })
        .optional(),
    gender: exports.GenderEnum,
    status: exports.ResidentStatusEnum.optional(),
    checkInDate: zod_1.z.coerce.date().optional(),
    checkOutDate: zod_1.z.coerce.date().optional(),
    emergencyContactName: zod_1.z
        .string({ required_error: "Emergency contact name is required" })
        .trim()
        .min(1, { message: "Emergency contact name can't be empty" }),
    emergencyContactPhone: zod_1.z
        .string({ required_error: "Emergency contact phone is required" })
        .trim()
        .min(1, { message: "Emergency contact phone can't be empty" }),
    emergencyContactRelationship: zod_1.z.string().optional(),
};
// Schema for creating a new Resident
exports.residentSchema = zod_1.z.object(Object.assign({ name: zod_1.z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, { message: "Name can't be empty" }), email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email must be a valid email address" })
        .min(1, { message: "Email can't be empty" }), phone: zod_1.z
        .string({ required_error: "Phone number is required" })
        .min(1, { message: "Phone number can't be empty" }), password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" }) }, baseResidentSchema));
// Schema for updating a Resident (all fields are optional)
exports.updateResidentSchema = exports.residentSchema.partial();
// Schema for admin adding a resident (password optional, will be generated)
exports.adminResidentSchema = zod_1.z.object(Object.assign({ name: zod_1.z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, { message: "Name can't be empty" }), email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email must be a valid email address" })
        .min(1, { message: "Email can't be empty" }), phone: zod_1.z
        .string({ required_error: "Phone number is required" })
        .min(1, { message: "Phone number can't be empty" }), password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .optional() }, baseResidentSchema));
