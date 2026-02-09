"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookServiceSchema = exports.createHostelServiceSchema = void 0;
const zod_1 = require("zod");
exports.createHostelServiceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().min(0, "Price must be non-negative"),
    availability: zod_1.z.boolean().default(true),
    hostelId: zod_1.z.string().cuid("Invalid hostel ID").optional(), // Optional for super_admin
});
exports.bookServiceSchema = zod_1.z.object({
    serviceId: zod_1.z.string().min(1, "Service ID is required"),
    bookingDate: zod_1.z.coerce.date({ required_error: "Booking date is required" }),
});
