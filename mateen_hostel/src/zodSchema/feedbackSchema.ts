import { z } from "zod";

export const createFeedbackSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    category: z.string().optional(),
});

export type CreateFeedbackDto = z.infer<typeof createFeedbackSchema>;
