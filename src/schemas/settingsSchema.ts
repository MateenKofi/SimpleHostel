import { z } from "zod";

export const settingsFormSchema = z.object({
  name: z.string().min(2, "Hostel name must be at least 2 characters"),
  description: z.string().optional().default(""),
  address: z.string().min(5, "Address must be at least 5 characters"),
  // These fields exist on the backend model but are not rendered in the settings
  // form UI, so they are optional to prevent silent validation failures.
  location: z.string().optional().default(""),
  manager: z.string().optional().default(""),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  ghCard: z.string().optional().default(""),
  allowPartialPayment: z.boolean().default(false),
  partialPaymentPercentage: z.coerce
    .number()
    .min(0, "Percentage must be at least 0")
    .max(100, "Percentage must be at most 100")
    .default(50),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
