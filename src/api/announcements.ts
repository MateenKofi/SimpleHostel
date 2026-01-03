import axiosInstance from "./axiosInstance";

export const getAnnouncements = async () => {
    const response = await axiosInstance.get("/v1/resident/announcements");
    return response.data;
};

export const getHostelAnnouncements = async (hostelId: string) => {
    const response = await axiosInstance.get(`/announcements/hostel/${hostelId}`);
    return response.data;
};

export const createAnnouncement = async (payload: any) => {
    const response = await axiosInstance.post("/admin/announcement/add", payload);
    return response.data;
};

export const getAnnouncementHistory = async () => {
    const response = await axiosInstance.get('/residents/announcements');
    return response.data;
};
