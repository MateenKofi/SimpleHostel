import { z } from "zod";

export const VisitorFormSchema = z.object({
  name: z.string().min(2, {
    message: "Visitor name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  residentId: z.string().min(1, {
    message: "Please select a resident.",
  }),
  purpose: z.string().optional(),
});

export type VisitorFormInputs = z.infer<typeof VisitorFormSchema>;
