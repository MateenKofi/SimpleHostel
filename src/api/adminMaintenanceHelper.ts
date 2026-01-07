import axiosInstance from "./axiosInstance";
import { MaintenanceRequestDto } from "@/types/dtos";

/**
 * Fetch all maintenance requests with optional filtering by status and priority.
 */
export const getAllMaintenanceRequests = async (filters?: { status?: string; priority?: string }): Promise<{ data: MaintenanceRequestDto[] }> => {
    const response = await axiosInstance.get("/v1/admin/maintenance", {
        params: filters
    });
    return response.data;
};

/**
 * Update the status or priority of a specific maintenance request.
 */
export const updateMaintenanceRequest = async (requestId: string, data: { status?: string; priority?: string }): Promise<{ data: MaintenanceRequestDto }> => {
    const response = await axiosInstance.patch(`/v1/admin/maintenance/${requestId}`, data);
    return response.data;
};

/**
 * Get summary statistics for maintenance requests.
 */
export const getMaintenanceStats = async (): Promise<{ data: { pending: number, in_progress: number, resolved: number, rejected: number, critical: number } }> => {
    const response = await axiosInstance.get("/v1/admin/maintenance/stats");
    return response.data;
};
