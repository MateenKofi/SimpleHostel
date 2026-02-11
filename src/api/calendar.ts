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

export const updateCalendarYear = async (id: string, payload: { name: string }) => {
    const response = await axiosInstance.put(`/calendar/update/${id}`, payload);
    return response.data;
};

export const deleteCalendarYear = async (id: string, hostelId: string) => {
    const response = await axiosInstance.delete(`/calendar/delete/${id}`, { data: { hostelId } });
    return response.data;
};

export const endCalendarYear = async (id: string) => {
    const response = await axiosInstance.patch(`/calendar/end/${id}`);
    return response.data;
};
