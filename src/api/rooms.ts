import axiosInstance from "./axiosInstance";

export const getHostelRooms = async (hostelId: string) => {
    const response = await axiosInstance.get(`/rooms/get/hostel/${hostelId}`);
    return response.data?.data;
};

export const getRoomDetails = async (roomId: string) => {
    const response = await axiosInstance.get(`/rooms/get/${roomId}`);
    return response.data?.data;
}

export const addRoom = async (formData: FormData) => {
    const response = await axiosInstance.post("/rooms/add", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateRoom = async (roomId: string, formData: FormData) => {
    const response = await axiosInstance.put(`/rooms/updateall/${roomId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteRoom = async (roomId: string) => {
    const response = await axiosInstance.delete(`/rooms/delete/${roomId}`);
    return response.data;
};
