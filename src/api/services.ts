import axiosInstance from "./axiosInstance";

export const getHostelServices = async (hostelId: string) => {
    const response = await axiosInstance.get(`/services/list/${hostelId}`);
    return response.data;
};

export const createService = async (payload: any) => {
    const response = await axiosInstance.post('/services/create', payload);
    return response.data;
};

export const getServiceBookings = async () => {
    const response = await axiosInstance.get(`/services/bookings`);
    return response.data;
};

export const bookService = async (data: any) => {
    const response = await axiosInstance.post('/services/book', data);
    return response.data;
};
