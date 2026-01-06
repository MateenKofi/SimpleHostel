import axiosInstance from "./axiosInstance";

export const getHostels = async () => {
    const response = await axiosInstance.get("/hostels/get");
    return response.data;
};

export const getHostelById = async (hostelId: string) => {
    const response = await axiosInstance.get(`/hostels/get/${hostelId}`);
    return response.data;
};

export const addHostel = async (formData: FormData) => {
    const response = await axiosInstance.post("/hostels/add", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateHostel = async (hostelId: string, data: any) => {
    const response = await axiosInstance.put(`/hostels/update/${hostelId}`, data);
    return response.data;
};

export const getUnverifiedHostels = async () => {
    const response = await axiosInstance.get("/hostels/unverified");
    return response.data;
};

export const verifyHostel = async (hostelId: string) => {
    const response = await axiosInstance.post(`/hostels/verify/${hostelId}`, {});
    return response.data;
};

export const deleteHostel = async (hostelId: string) => {
    const response = await axiosInstance.delete(`/hostels/delete/${hostelId}`);
    return response.data;
};

export const updateHostelRules = async (hostelId: string, formData: FormData) => {
    const response = await axiosInstance.put(`/hostels/rules/${hostelId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const publishHostel = async (hostelId: string) => {
    const response = await axiosInstance.put(`/hostels/publish/${hostelId}`, {});
    return response.data;
};

export const unpublishHostel = async (hostelId: string) => {
    const response = await axiosInstance.put(`/hostels/unpublish/${hostelId}`, {});
    return response.data;
};

export const updatePaymentSettings = async (hostelId: string, data: { allowPartialPayment: boolean, partialPaymentPercentage: number }) => {
    const response = await axiosInstance.put(`/hostels/payment-settings/${hostelId}`, data);
    return response.data;
};

export const updateHostelDocuments = async (hostelId: string, formData: FormData) => {
    const response = await axiosInstance.put(`/hostels/documents/${hostelId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
