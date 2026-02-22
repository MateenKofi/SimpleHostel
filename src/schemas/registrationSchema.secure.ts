/**
 * SECURE Registration Schema
 * Updated with strong password requirements
 */

import { z } from "zod";

/**
 * Password validation regex patterns
 */
const passwordPatterns = {
    hasLower: /[a-z]/,
    hasUpper: /[A-Z]/,
    hasNumber: /\d/,
    hasSpecial: /[^a-zA-Z0-9]/,
};

/**
 * Strong password validation schema
 * - Minimum 12 characters (up from 8)
 * - Must contain uppercase and lowercase letters
 * - Must contain at least one number
 * - Must contain at least one special character
 */
const passwordSchema = z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(passwordPatterns.hasLower, "Password must contain at least one lowercase letter")
    .regex(passwordPatterns.hasUpper, "Password must contain at least one uppercase letter")
    .regex(passwordPatterns.hasNumber, "Password must contain at least one number")
    .regex(passwordPatterns.hasSpecial, "Password must contain at least one special character")
    .refine(
        (password) => !/(.)\1{2,}/.test(password),
        "Password should not contain repeated characters (e.g., 'aaa')"
    )
    .refine(
        (password) => !/(password|123456|qwerty)/i.test(password),
        "Password is too common. Please choose a more secure password."
    );

export const registrationSchema = z.object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string()
        .min(10, "Phone number must be at least 10 characters")
        .regex(/^[\d\s\-+()]+$/, "Phone number can only contain digits, spaces, and special characters (+, -, (, ))"),
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
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => {
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
    const hasLower = passwordPatterns.hasLower.test(password);
    const hasUpper = passwordPatterns.hasUpper.test(password);
    const hasNumber = passwordPatterns.hasNumber.test(password);
    const hasSpecial = passwordPatterns.hasSpecial.test(password);
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
