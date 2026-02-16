import { z } from "zod";

export const announcementFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(["general", "policy", "event", "emergency"]),
  priority: z.enum(["low", "high", "urgent"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;
