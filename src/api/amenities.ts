import axiosInstance from "./axiosInstance";

export const getHostelAmenities = async (hostelId: string) => {
    const response = await axiosInstance.get(`/amenities/hostel/${hostelId}`);
    return response.data;
};

export const addAmenity = async (data: any) => {
    const response = await axiosInstance.post(`/amenities/add`, data);
    return response.data;
};

export const updateAmenity = async (amenityId: string, data: any) => {
    const response = await axiosInstance.put(`/amenities/update/${amenityId}`, data);
    return response.data;
};

export const deleteAmenity = async (amenityId: string) => {
    const response = await axiosInstance.delete(`/amenities/delete/${amenityId}`);
    return response.data;
};
