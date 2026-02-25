import { z } from "zod";

/**
 * Strong password validation
 * - Minimum 12 characters (upgraded from 8)
 * - Must contain uppercase and lowercase
 * - Must contain at least one number
 * - Must contain at least one special character
 */
const passwordSchema = z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
    .refine((password) => !/(.)\1{2,}/.test(password), "Password should not contain repeated characters")
    .refine((password) => !/(password|123456|qwerty)/i.test(password), "Password is too common. Please choose a more secure password.");

export const registrationSchema = z.object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string()
        .min(10, "Phone number must be at least 10 characters")
        .regex(/^[\d\s\-+()]+$/, "Phone number can only contain digits, spaces, and special characters"),
    password: passwordSchema,
    confirmPassword: z.string().min(12, "Please confirm your password"),
    gender: z.enum(["male", "female", "other"], {
        errorMap: () => ({ message: "Please select a valid gender" }),
    }),
    emergencyContactName: z.string().min(2, "Emergency contact name is required"),
    emergencyContactPhone: z.string()
        .min(10, "Emergency contact phone is required")
        .regex(/^[\d\s\-+()]+$/, "Invalid phone number format"),
    emergencyContactRelationship: z.string().optional().nullable(),
    studentId: z.string().optional().nullable(),
    course: z.string().optional().nullable(),
    roomId: z.string().optional().nullable(),
    hostelId: z.string().optional().nullable(),
}).refine((data) => {
    // Only validate if both are provided
    if (!data.password || !data.confirmPassword) return true;
    return data.password === data.confirmPassword;
}, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => {
    // Only validate if all relevant fields are provided
    if (!data.password || !data.email || !data.name) return true;

    // Ensure password doesn't contain email or name (common pattern)
    const emailPart = data.email.split("@")[0].toLowerCase();
    const namePart = data.name.toLowerCase().split(" ")[0];

    const lowerPassword = data.password.toLowerCase();
    if (emailPart && lowerPassword.includes(emailPart)) {
        return false;
    }
    if (namePart && lowerPassword.includes(namePart)) {
        return false;
    }
    return true;
}, {
    message: "Password should not contain your name or email",
    path: ["password"],
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

/**
 * Calculate password strength for UI display
 */
export function getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
} {
    if (!password) {
        return { score: 0, label: "", color: "bg-gray-200" };
    }

    let score = 0;

    // Length score
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Character variety score
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (varietyCount >= 2) score++;
    if (varietyCount >= 3) score++;
    if (varietyCount === 4) score++;

    // Deductions
    if (/(.)\1{2,}/.test(password)) score -= 1;
    if (/^[0-9]+$/.test(password)) score -= 1;
    if (/^[a-zA-Z]+$/.test(password)) score -= 1;

    score = Math.max(0, Math.min(5, score));

    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = [
        "bg-gray-200",
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-emerald-600",
    ];

    return {
        score,
        label: labels[score],
        color: colors[score],
    };
}

/**
 * Check if password meets all requirements
 */
export function getPasswordRequirements(password: string): {
    valid: boolean;
    requirements: { label: string; met: boolean }[];
} {
    const requirements = [
        { label: "At least 12 characters", met: password.length >= 12 },
        { label: "Uppercase & lowercase letters", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
        { label: "At least one number", met: /\d/.test(password) },
        { label: "At least one special character", met: /[^a-zA-Z0-9]/.test(password) },
    ];

    const valid = requirements.every((req) => req.met);

    return { valid, requirements };
}
