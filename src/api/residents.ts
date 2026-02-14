import axiosInstance from "./axiosInstance";
import { AddResidentRequest, CreateResidentRequestRequest, FeedbackRequest, MaintenanceRequestDto, RegisterResidentRequest, ResidentDto, UserDto } from "@/types/dtos";

export const registerResident = async (payload: RegisterResidentRequest | FormData): Promise<{ data: UserDto }> => {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.post("/residents/register", payload, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
};

export const addResident = async (payload: AddResidentRequest | FormData): Promise<{ data: ResidentDto }> => {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.post("/residents/add", payload, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
};

export const getResidentRoomDetails = async (): Promise<{ data: ResidentDto }> => {
    const response = await axiosInstance.get("/residents/room");
    return response.data;
};

export const getResidentBilling = async () => {
    const response = await axiosInstance.get("/resident/billing");
    return response.data;
};

export const getPaymentReceipt = async (paymentId: string) => {
    const response = await axiosInstance.get(`/resident/receipt/${paymentId}`);
    return response.data;
};

export const getResidentRequests = async (): Promise<{ data: MaintenanceRequestDto[] }> => {
    const response = await axiosInstance.get("/residents/requests");
    return response.data;
};

export const createResidentRequest = async (data: CreateResidentRequestRequest | FormData): Promise<{ data: MaintenanceRequestDto }> => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post("/residents/requests", data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
    });
    return response.data;
};

export const submitFeedback = async (data: FeedbackRequest) => {
    const response = await axiosInstance.post("/residents/feedback", data);
    return response.data;
};

export const getResidentAllocationDetails = async () => {
    const response = await axiosInstance.get("/residents/allocation-details");
    return response.data;
};

export const getHostelResidents = async (hostelId: string) => {
    const response = await axiosInstance.get(`/residents/hostel/${hostelId}`);
    return response.data;
};

export const deleteResident = async (residentId: string, hostelId: string) => {
    const response = await axiosInstance.delete(`/residents/delete/${residentId}`, {
        params: { hostelId }
    });
    return response.data;
};

export const restoreResident = async (residentId: string, hostelId: string) => {
    const response = await axiosInstance.post(`/residents/restore/${residentId}`, {}, {
        params: { hostelId }
    });
    return response.data;
};

export const updateResident = async (residentId: string, data: Partial<ResidentDto> & { name?: string; email?: string; phone?: string; gender?: string; emergencyContactRelationship?: string }) => {
    const response = await axiosInstance.put(`/residents/update/${residentId}`, data);
    return response.data;
};

export const getResidentById = async (residentId: string): Promise<{ data: ResidentDto }> => {
    const response = await axiosInstance.get(`/residents/${residentId}`);
    return response.data;
};

export const verifyResidentAccessCode = async (code: string, hostelId?: string): Promise<{ data: ResidentDto }> => {
    const response = await axiosInstance.post("/residents/verify", { code, hostelId });
    return response.data;
};

export const checkInResident = async (residentId: string): Promise<{ data: ResidentDto }> => {
    const response = await axiosInstance.post(`/residents/${residentId}/checkin`);
    return response.data;
};

// Download Allocation Letter as PDF
export const downloadAllocationLetterPDF = async () => {
    const response = await axiosInstance.get("/residents/allocation-details/download", {
        responseType: "blob", // Important: get the response as a Blob
    });
    return response.data;
};

// Download Payment Receipt as PDF
export const downloadPaymentReceiptPDF = async (paymentId: string) => {
    const response = await axiosInstance.get(`/residents/receipt/${paymentId}/download`, {
        responseType: "blob", // Important: get the response as a Blob
    });
    return response.data;
};
