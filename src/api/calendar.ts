import axiosInstance from "./axiosInstance";

export const getCurrentCalendarYear = async (hostelId: string) => {
    const response = await axiosInstance.get(`/calendar/current/${hostelId}`);
    return response.data;
};

export const getHistoricalCalendarYears = async (hostelId: string) => {
    const response = await axiosInstance.get(`/calendar/historical/${hostelId}`);
    return response.data;
};

export const startCalendarYear = async (payload: { name: string; hostelId: string }) => {
    const response = await axiosInstance.post(`/calendar/start`, payload);
    return response.data;
};
