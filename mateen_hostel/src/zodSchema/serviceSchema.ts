import { z } from "zod";

export const createHostelServiceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be non-negative"),
    availability: z.boolean().default(true),
    hostelId: z.string().cuid("Invalid hostel ID").optional(), // Optional for super_admin
});

export const bookServiceSchema = z.object({
    serviceId: z.string().min(1, "Service ID is required"),
    bookingDate: z.coerce.date({ required_error: "Booking date is required" }),
});

export type CreateHostelServiceDto = z.infer<typeof createHostelServiceSchema>;
export type BookServiceDto = z.infer<typeof bookServiceSchema>;
