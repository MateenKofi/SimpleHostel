import { z } from "zod";

export const hostelListingFormSchema = z.object({
  hostelImage: z.string().optional(),
  description: z.string().optional(),
  hostelName: z.string().min(2, "Hostel name must be at least 2 characters"),
  location: z.string().min(1, "Please select a location"),
  address: z.string().min(1, "Address must follow the format XX-XXX-XXXX. Address from Ghana post code"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  managerName: z.string().min(2, "Manager name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  ghanaCard: z.string().regex(/^GHA-\d{9}-\d$/, {
    message: "Ghana Card must follow the format GHA-xxxxxxxxx-x",
  }),
});

export type HostelListingFormValues = z.infer<typeof hostelListingFormSchema>;
