import prisma from "../utils/prisma";
import { CreateAnnouncementDto, UpdateAnnouncementDto } from "../zodSchema/announcementSchema";
import { formatPrismaError } from "../utils/formatPrisma";

export const addAnnouncement = async (
    hostelId: string,
    data: CreateAnnouncementDto
) => {
    try {
        const announcement = await prisma.announcement.create({
            data: {
                hostelId,
                title: data.title,
                content: data.content,
                category: data.category,
                priority: data.priority,
                startDate: data.startDate,
                endDate: data.endDate,
            },
        });
        return announcement;
    } catch (error) {
        throw formatPrismaError(error);
    }
};

export const updateAnnouncement = async (
    announcementId: string,
    hostelId: string,
    data: UpdateAnnouncementDto
) => {
    try {
        // Verify the announcement belongs to the user's hostel
        const existing = await prisma.announcement.findUnique({
            where: { id: announcementId },
        });

        if (!existing) {
            const error: any = new Error("Announcement not found");
            error.status = 404;
            throw error;
        }

        if (existing.hostelId !== hostelId) {
            const error: any = new Error("You can only update announcements from your hostel");
            error.status = 403;
            throw error;
        }

        const announcement = await prisma.announcement.update({
            where: { id: announcementId },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.content !== undefined && { content: data.content }),
                ...(data.category !== undefined && { category: data.category }),
                ...(data.priority !== undefined && { priority: data.priority }),
                ...(data.startDate !== undefined && { startDate: data.startDate }),
                ...(data.endDate !== undefined && { endDate: data.endDate }),
            },
        });
        return announcement;
    } catch (error) {
        throw formatPrismaError(error);
    }
};

export const deleteAnnouncement = async (
    announcementId: string,
    hostelId: string
) => {
    try {
        // Verify the announcement belongs to the user's hostel
        const existing = await prisma.announcement.findUnique({
            where: { id: announcementId },
        });

        if (!existing) {
            const error: any = new Error("Announcement not found");
            error.status = 404;
            throw error;
        }

        if (existing.hostelId !== hostelId) {
            const error: any = new Error("You can only delete announcements from your hostel");
            error.status = 403;
            throw error;
        }

        await prisma.announcement.delete({
            where: { id: announcementId },
        });
        return { message: "Announcement deleted successfully" };
    } catch (error) {
        throw formatPrismaError(error);
    }
};
