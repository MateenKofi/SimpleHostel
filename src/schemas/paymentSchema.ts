import { z } from "zod";

export const paymentFormSchema = z.object({
  paymentAmount: z.number().min(1, "Payment amount must be greater than 0"),
});

export type PaymentInputs = z.infer<typeof paymentFormSchema>;
