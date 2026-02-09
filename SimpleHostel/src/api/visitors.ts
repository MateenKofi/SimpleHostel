import axiosInstance from "./axiosInstance";

export const getHostelVisitors = async (hostelId: string) => {
    const response = await axiosInstance.get(`/visitors/hostel/${hostelId}`);
    return response.data;
};

export const addVisitor = async (formData: FormData) => {
    const response = await axiosInstance.post(`/visitors/add`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const checkoutVisitor = async (visitorId: string) => {
    const response = await axiosInstance.put(`/visitors/checkout/${visitorId}`);
    return response.data;
};
