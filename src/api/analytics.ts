import axiosInstance from "./axiosInstance";

export const getResidentAnalytics = async (userId: string) => {
    const response = await axiosInstance.get(`/analytics/get/resident-dashboard/${userId}`);
    return response.data;
};

export const getDisbursementSummary = async () => {
    const response = await axiosInstance.get("/analytics/get/disbursement-summary");
    return response.data;
};

export const getCalendarYearReport = async (hostelId: string, calendarYearId: string) => {
    const response = await axiosInstance.get(`/analytics/calendar-year/${hostelId}/${calendarYearId}`);
    return response.data;
};

export const getHostelAnalytics = async (hostelId: string) => {
    const response = await axiosInstance.get(`/analytics/get/hostel/${hostelId}`);
    return response.data;
};

export const getSystemAnalytics = async () => {
    const response = await axiosInstance.get("/analytics/get/system");
    return response.data;
};
