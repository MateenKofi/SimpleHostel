import axiosInstance from "./axiosInstance";
import { MaintenanceRequestDto } from "@/types/dtos";

/**
 * Fetch all maintenance requests with optional filtering by status, priority, and historical.
 * @param filters - Optional filters including status, priority, and historical flag
 */
export const getAllMaintenanceRequests = async (filters?: { status?: string; priority?: string; historical?: boolean }): Promise<{ data: MaintenanceRequestDto[] }> => {
    const response = await axiosInstance.get("/admin/maintenance", {
        params: filters
    });
    return response.data;
};

/**
 * Update the status or priority of a specific maintenance request.
 */
export const updateMaintenanceRequest = async (requestId: string, data: { status?: string; priority?: string }): Promise<{ data: MaintenanceRequestDto }> => {
    const response = await axiosInstance.patch(`/admin/maintenance/${requestId}`, data);
    return response.data;
};

/**
 * Get summary statistics for maintenance requests.
 * @param historical - If true, returns historical stats. If false (default), returns current year stats only.
 */
export const getMaintenanceStats = async (historical?: boolean): Promise<{ data: { pending: number, in_progress: number, resolved: number, rejected: number, critical: number } }> => {
    const response = await axiosInstance.get("/admin/maintenance/stats", {
        params: { historical: historical ?? false }
    });
    return response.data;
};
