import { z } from "zod";

export const rejectDisbursementSchema = z.object({
  reason: z.string().min(10, "Rejection reason must be at least 10 characters"),
});

export type RejectDisbursementInput = z.infer<typeof rejectDisbursementSchema>;