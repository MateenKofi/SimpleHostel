import axiosInstance from "./axiosInstance";
import type { CreateAnnouncementRequest } from "@/types/dtos";

export const getAnnouncements = async () => {
    const response = await axiosInstance.get("/resident/announcements");
    return response.data;
};

export const getHostelAnnouncements = async (hostelId: string) => {
    const response = await axiosInstance.get(`/announcements/hostel/${hostelId}`);
    return response.data;
};

export const createAnnouncement = async (payload: CreateAnnouncementRequest) => {
    const response = await axiosInstance.post("/admin/announcement/add", payload);
    return response.data;
};

export const updateAnnouncement = async (announcementId: string, payload: Partial<CreateAnnouncementRequest>) => {
    const response = await axiosInstance.patch(`/admin/announcement/${announcementId}`, payload);
    return response.data;
};

export const deleteAnnouncement = async (announcementId: string) => {
    const response = await axiosInstance.delete(`/admin/announcement/${announcementId}`);
    return response.data;
};

export const getAnnouncementHistory = async () => {
    const response = await axiosInstance.get('/residents/announcements');
    return response.data;
};
