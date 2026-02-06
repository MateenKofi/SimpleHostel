import axiosInstance from "./axiosInstance";
import { AddResidentRequest, CreateResidentRequestRequest, FeedbackRequest, MaintenanceRequestDto, RegisterResidentRequest, ResidentDto, UserDto } from "@/types/dtos";

export const registerResident = async (payload: RegisterResidentRequest | FormData): Promise<{ data: UserDto }> => {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.post("/v1/residents/register", payload, {
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

export const updateResident = async (residentId: string, formData: FormData) => {
    const response = await axiosInstance.put(`/residents/update/${residentId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
