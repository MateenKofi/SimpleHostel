import axiosInstance from "./axiosInstance";
import type { RegisterResidentRequest } from "@/types/dtos";

export const loginUser = async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post("/users/login", data);
    return response.data;
};

export const signupUser = async (data: RegisterResidentRequest | FormData) => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post("/users/signup", data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
};

export const resetPassword = async (data: { email: string }) => {
    const response = await axiosInstance.post("/users/reset-password", data);
    return response.data;
};
