import axiosInstance from "./axiosInstance";

export const initPayment = async (payload: { roomId: string, residentId: string, initialPayment: number }) => {
    const response = await axiosInstance.post("/payments/init", payload);
    return response.data;
};

export const confirmPayment = async (reference: string) => {
    const response = await axiosInstance.get(`/payments/confirm?reference=${reference}`);
    return response.data;
};

export const topupPayment = async (payload: any) => {
    const response = await axiosInstance.post("/payments/topup", payload);
    return response.data;
};

export const verifyPaymentTopup = async (reference: string) => {
    const response = await axiosInstance.get(`/payments/verify-topup?reference=${reference}`);
    return response.data;
}

export const getHostelTransactions = async (hostelId: string) => {
    const response = await axiosInstance.get(`/payments/get/hostel/${hostelId}`);
    return response.data;
};

export const verifyPayment = async (reference: string) => {
    const response = await axiosInstance.get(`/payments/verify?reference=${reference}`);
    return response.data;
};

export const getPaymentByRef = async (reference: string) => {
    const response = await axiosInstance.get(`/payments/get/ref/${reference}`);
    return response.data;
};
