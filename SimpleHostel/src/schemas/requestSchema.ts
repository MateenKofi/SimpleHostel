import { z } from "zod";

export const updateMaintenanceRequestSchema = z.object({
    status: z.enum(["pending", "in_progress", "resolved", "rejected"]).optional(),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
});

export type UpdateMaintenanceRequestInput = z.infer<typeof updateMaintenanceRequestSchema>;
