import { z } from "zod";

export const registrationSchema = z.object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    gender: z.enum(["male", "female", "other"], {
        errorMap: () => ({ message: "Please select a valid gender" }),
    }),
    emergencyContactName: z.string().min(2, "Emergency contact name is required"),
    emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
    emergencyContactRelationship: z.string().optional().nullable(),
    studentId: z.string().optional().nullable(),
    course: z.string().optional().nullable(),
    roomId: z.string().optional().nullable(),
    hostelId: z.string().optional().nullable(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
