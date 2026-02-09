import axiosInstance from "./axiosInstance";
import type { CreateServiceRequest } from "@/types/dtos";

export const getHostelServices = async (hostelId: string) => {
    const response = await axiosInstance.get(`/services/list/${hostelId}`);
    return response.data;
};

export const createService = async (payload: CreateServiceRequest) => {
    const response = await axiosInstance.post('/services/create', payload);
    return response.data;
};
