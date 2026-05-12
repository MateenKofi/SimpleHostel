/**
 * Admin Authentication API
 * Super admin endpoints for managing user passwords
 */

import axiosInstance from "./axiosInstance";

export type PasswordResetMethod = "reset_link" | "temp_password";

export interface TriggerPasswordResetRequest {
  method: PasswordResetMethod;
}

export interface TriggerPasswordResetResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    userEmail: string;
    userName: string;
    role: string;
    method: PasswordResetMethod;
    triggeredBy: string;
    triggeredAt: string;
  };
}

export interface PasswordResetAuditEntry {
  id: string;
  triggeredBy: string;
  triggeredByEmail: string;
  targetUserId: string;
  targetUserEmail: string;
  targetUserName: string;
  method: PasswordResetMethod;
  tempPassword: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface AuditLogResponse {
  data: PasswordResetAuditEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Trigger password reset for a user
 * POST /api/v1/admin/users/:userId/trigger-password-reset
 *
 * @param userId - The ID of the user to reset password for
 * @param method - Either "reset_link" or "temp_password"
 */
export const triggerUserPasswordReset = async (
  userId: string,
  method: PasswordResetMethod
): Promise<TriggerPasswordResetResponse> => {
  const response = await axiosInstance.post(
    `/admin/users/${userId}/trigger-password-reset`,
    { method }
  );
  return response.data;
};

/**
 * Get password reset audit log
 * GET /api/v1/admin/password-reset-audit
 *
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 */
export const getPasswordResetAuditLog = async (
  page: number = 1,
  limit: number = 20
): Promise<AuditLogResponse> => {
  const response = await axiosInstance.get("/admin/password-reset-audit", {
    params: { page, limit },
  });
  return response.data;
};