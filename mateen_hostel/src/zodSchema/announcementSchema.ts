import { z } from "zod";

export const createAnnouncementSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    category: z.string().optional().default("general"),
    priority: z.string().optional().default("normal"),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

export const updateAnnouncementSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().min(1, "Content is required").optional(),
    category: z.string().optional(),
    priority: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

export type CreateAnnouncementDto = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementDto = z.infer<typeof updateAnnouncementSchema>;
