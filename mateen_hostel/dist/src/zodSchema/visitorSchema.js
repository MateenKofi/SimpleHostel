"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVisitorSchema = exports.visitorSchema = void 0;
const zod_1 = require("zod");
// Schema to create a new visitor
exports.visitorSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Visitor's name is required" })
        .trim()
        .min(1, { message: "Visitor's name can't be empty" }),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email must be a valid email address" })
        .min(1, { message: "Email can't be empty" }),
    phone: zod_1.z
        .string({ required_error: "Phone number is required" })
        .min(1, { message: "Phone number can't be empty" }),
    residentId: zod_1.z
        .string({ required_error: "Resident ID is required" })
        .min(1, { message: "Resident ID can't be empty" }),
});
// Schema for updating a visitor (all fields are optional)
exports.updateVisitorSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Visitor's name is required" })
        .trim()
        .min(1, { message: "Visitor's name can't be empty" })
        .optional(),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email must be a valid email address" })
        .min(1, { message: "Email can't be empty" })
        .optional(),
    phone: zod_1.z
        .string({ required_error: "Phone number is required" })
        .min(1, { message: "Phone number can't be empty" })
        .optional(),
});
