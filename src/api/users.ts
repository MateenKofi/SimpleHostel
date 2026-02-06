import axiosInstance from "./axiosInstance";
import type { UpdateUserRequest } from "@/types/dtos";

export const getUserById = async (userId: string) => {
    const response = await axiosInstance.get(`/users/get/${userId}`);
    return response.data;
};

export const updateUser = async (userId: string, data: UpdateUserRequest | FormData) => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.put(`/users/update/${userId}`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axiosInstance.get("/users/get");
    return response.data;
};

export const deleteUser = async (userId: string) => {
    const response = await axiosInstance.delete(`/users/delete/${userId}`);
    return response.data;
};
