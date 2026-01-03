import axiosInstance from "./axiosInstance";

export const getHostelStaff = async (hostelId: string) => {
    const response = await axiosInstance.get(`/Staffs/get/hostel/${hostelId}`);
    return response.data;
};

export const deleteStaff = async (staffId: string) => {
    const response = await axiosInstance.delete(`/Staffs/delete/${staffId}`);
    return response.data;
};

export const addStaff = async (data: any) => {
    const response = await axiosInstance.post("/Staffs/add", data);
    return response.data;
};

export const updateStaff = async (staffId: string, data: any) => {
    const response = await axiosInstance.put(`/Staffs/update/${staffId}`, data);
    return response.data;
};

export const getStaffById = async (staffId: string) => {
    const response = await axiosInstance.get(`/Staffs/get/${staffId}`);
    return response.data;
};
