/**
 * Secure Authentication API
 * Updated with security fixes:
 * - Password reset now uses time-limited tokens (not email passwords)
 * - All endpoints include proper error handling
 * - Reset split into request/confirm endpoints
 */

import axiosInstance from "./axiosInstance";
import type { RegisterResidentRequest } from "@/types/dtos";

/**
 * User login
 * POST /api/v1/users/login
 */
export const loginUser = async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post("/users/login", data);
    return response.data;
};

/**
 * User signup/registration
 * POST /api/v1/users/signup
 */
export const signupUser = async (data: RegisterResidentRequest | FormData) => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post("/users/signup", data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
};

/**
 * Request password reset (sends email with token)
 * NEW ENDPOINT - replaces insecure email password flow
 * POST /api/v1/users/reset-password/request
 */
export const requestPasswordReset = async (data: { email: string }) => {
    const response = await axiosInstance.post("/users/reset-password/request", data);
    return response.data;
};

/**
 * Confirm password reset with token
 * NEW ENDPOINT - completes the reset flow
 * POST /api/v1/users/reset-password/confirm
 */
export const confirmPasswordReset = async (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    const response = await axiosInstance.post("/users/reset-password/confirm", data);
    return response.data;
};

/**
 * Legacy password reset (deprecated - for backward compatibility)
 * This will be removed once backend is updated
 * POST /api/v1/users/reset-password
 * @deprecated Use requestPasswordReset + confirmPasswordReset instead
 */
export const resetPassword = async (data: { email: string }) => {
    console.warn("resetPassword is deprecated. Use requestPasswordReset instead.");
    const response = await axiosInstance.post("/users/reset-password", data);
    return response.data;
};

/**
 * User logout
 * POST /api/v1/users/logout
 * Blacklists the JWT token on the server
 */
export const logoutUser = async () => {
    const response = await axiosInstance.post("/users/logout");
    return response.data;
};

/**
 * Validate password reset token
 * GET /api/v1/users/reset-password/validate?token=xxx
 */
export const validateResetToken = async (token: string) => {
    const response = await axiosInstance.get(`/users/reset-password/validate?token=${token}`);
    return response.data;
};

/**
 * Get current user profile
 * GET /api/v1/users/profile
 */
export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/users/profile");
    return response.data;
};
