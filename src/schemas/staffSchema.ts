import { z } from "zod";
import dayjs from "dayjs";

const ghanaPhoneRegex = /^(?:\+233|233|0)[0-9\s-]{9,15}$/;
// Flexible Ghana Card regex to allow both 4-4-4 and other common patterns like 9-1
const ghanaCardRegex = /^GHA-[A-Z0-9-]{10,20}$/i;

export const staffSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      ghanaPhoneRegex,
      "Phone must be valid Ghana format (e.g. 024 123 4567)"
    )
    .transform((val) => val.replace(/[\s-]/g, "")),
  role: z.string().min(1, "Role is required"),
  staffType: z.string().min(1, "Staff type is required"),
  middleName: z.string().optional(),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const age = dayjs().diff(dayjs(val), "year");
      return age >= 18;
    }, "Staff must be at least 18 years old")
    .refine((val) => {
      return dayjs(val).isBefore(dayjs());
    }, "Date of birth cannot be in the future"),
  nationality: z.string().min(2, "Nationality is required"),
  gender: z.string().min(1, "Gender is required"),
  religion: z.string().min(1, "Religion is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  ghanaCardNumber: z
    .string()
    .regex(ghanaCardRegex, "Invalid Ghana card format (e.g. GHA-123456789-0)"),
  residence: z.string().min(2, "Residence is required"),
  qualification: z.string().min(1, "Qualification is required"),
  block: z.string().optional(),
  dateOfAppointment: z.string().min(1, "Date of appointment is required"),
});

export type StaffFormData = z.infer<typeof staffSchema>;