import axiosInstance from "./axiosInstance";

export const loginUser = async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post("/users/login", data);
    return response.data;
};

export const signupUser = async (data: any) => {
    const response = await axiosInstance.post("/users/signup", data);
    return response.data;
};

export const resetPassword = async (data: { email: string }) => {
    const response = await axiosInstance.post("/users/reset-password", data);
    return response.data;
};
