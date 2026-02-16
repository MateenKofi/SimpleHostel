import { z } from "zod";

export const settingsFormSchema = z.object({
  name: z.string().min(2, "Hostel name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  manager: z.string().min(2, "Manager name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  ghCard: z.string().min(5, "Ghana Card must be at least 5 characters"),
  allowPartialPayment: z.boolean().default(false),
  partialPaymentPercentage: z.coerce.number().min(0, "Percentage must be at least 0").max(100, "Percentage must be at most 100").default(50),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
