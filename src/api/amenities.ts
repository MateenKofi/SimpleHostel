import axiosInstance from "./axiosInstance";
import type { AddAmenityRequest, UpdateAmenityRequest } from "@/types/dtos";

export const getHostelAmenities = async (hostelId: string) => {
    const response = await axiosInstance.get(`/amenities/hostel/${hostelId}`);
    return response.data;
};

export const addAmenity = async (data: AddAmenityRequest) => {
    const response = await axiosInstance.post(`/amenities/add`, data);
    return response.data;
};

export const updateAmenity = async (amenityId: string, data: UpdateAmenityRequest) => {
    const response = await axiosInstance.put(`/amenities/update/${amenityId}`, data);
    return response.data;
};

export const deleteAmenity = async (amenityId: string) => {
    const response = await axiosInstance.delete(`/amenities/delete/${amenityId}`);
    return response.data;
};
