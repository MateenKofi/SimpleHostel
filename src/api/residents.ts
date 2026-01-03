import axiosInstance from "./axiosInstance";

export const registerResident = async (formData: FormData) => {
    const response = await axiosInstance.post("/residents/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const addResident = async (payload: any) => {
    const response = await axiosInstance.post("/residents/add", payload);
    return response.data;
};

export const getResidentRoomDetails = async () => {
    const response = await axiosInstance.get("/residents/room");
    return response.data;
};

export const getResidentBilling = async () => {
    const response = await axiosInstance.get("/v1/resident/billing");
    return response.data;
};

export const getPaymentReceipt = async (receiptId: string) => {
    const response = await axiosInstance.get(`/residents/receipt/${receiptId}`);
    return response.data;
};

export const getResidentRequests = async () => {
    const response = await axiosInstance.get("/residents/requests");
    return response.data;
};

export const createResidentRequest = async (data: any) => {
    const response = await axiosInstance.post("/residents/requests", data);
    return response.data;
};

export const submitFeedback = async (data: any) => {
    const response = await axiosInstance.post("/residents/feedback", data);
    return response.data;
};

export const getResidentAllocationDetails = async () => {
    const response = await axiosInstance.get("/residents/allocation-details");
    return response.data;
};

export const getHostelResidents = async (hostelId: string) => {
    const response = await axiosInstance.get(`/residents/hostel/${hostelId}`);
    return response.data;
};

export const deleteResident = async (residentId: string, hostelId: string) => {
    const response = await axiosInstance.delete(`/residents/delete/${residentId}`, {
        params: { hostelId }
    });
    return response.data;
};

export const updateResident = async (residentId: string, formData: FormData) => {
    const response = await axiosInstance.put(`/residents/update/${residentId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
