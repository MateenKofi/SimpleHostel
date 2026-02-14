import axiosInstance from "./axiosInstance";

export const getHostelVisitors = async (hostelId: string) => {
    const response = await axiosInstance.get(`/visitors/hostel/${hostelId}`);
    return response.data;
};

export interface AddVisitorRequest {
    name: string;
    phone: string;
    email: string;
    residentId: string;
}

export const addVisitor = async (data: AddVisitorRequest) => {
    const response = await axiosInstance.post(`/visitors/add`, data);
    return response.data;
};

export const checkoutVisitor = async (visitorId: string) => {
    const response = await axiosInstance.put(`/visitors/checkout/${visitorId}`);
    return response.data;
};
