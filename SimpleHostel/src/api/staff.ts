import axiosInstance from "./axiosInstance";
import type { AddStaffRequest } from "@/types/dtos";

export const getHostelStaff = async (hostelId: string) => {
    const response = await axiosInstance.get(`/Staffs/get/hostel/${hostelId}`);
    return response.data;
};

export const deleteStaff = async (staffId: string) => {
    const response = await axiosInstance.delete(`/Staffs/delete/${staffId}`);
    return response.data;
};

export const addStaff = async (data: AddStaffRequest | FormData) => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post("/Staffs/add", data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
};

export const updateStaff = async (staffId: string, data: Partial<AddStaffRequest> | FormData) => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.put(`/Staffs/update/${staffId}`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
};

export const getStaffById = async (staffId: string) => {
    const response = await axiosInstance.get(`/Staffs/get/${staffId}`);
    return response.data;
};
