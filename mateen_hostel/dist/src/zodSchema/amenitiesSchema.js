"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAmenitiesSchema = exports.amenitiesSchema = void 0;
const zod_1 = require("zod");
// Schema for creating amenities
exports.amenitiesSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    price: zod_1.z.number().min(0, { message: "Price must be a non-negative value" }),
    hostelId: zod_1.z.string({ required_error: "HOSTEL ID is required" }).cuid("Invalid hostel ID"),
});
// Schema for updating amenities
exports.updateAmenitiesSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }).optional(),
    price: zod_1.z
        .number()
        .min(0, { message: "Price must be a non-negative value" })
        .optional(),
    hostelId: zod_1.z.string({ required_error: "HOSTEL ID is required" }).cuid("Invalid hostel ID").optional()
});
