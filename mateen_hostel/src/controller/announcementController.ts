import { Request, Response } from "express";
import * as announcementHelper from "../helper/announcementHelper";
import { HttpStatus } from "../utils/http-status";
import { formatPrismaError } from "../utils/formatPrisma";
import { CreateAnnouncementDto, createAnnouncementSchema, UpdateAnnouncementDto, updateAnnouncementSchema } from "../zodSchema/announcementSchema";
import HttpException from "../utils/http-error";

export const addAnnouncementController = async (req: Request, res: Response) => {
    try {
        const announcementData: CreateAnnouncementDto = createAnnouncementSchema.parse(req.body);
        const hostelId = req.user?.hostelId;

        if (!hostelId) {
            throw new HttpException(
                HttpStatus.FORBIDDEN,
                "You must be assigned to a hostel to create announcements"
            );
        }

        const newAnnouncement = await announcementHelper.addAnnouncement(
            hostelId,
            announcementData
        );

        res.status(HttpStatus.CREATED).json({
            message: "Announcement created successfully",
            data: newAnnouncement,
        });
    } catch (error) {
        const err = formatPrismaError(error);
        res.status(err.status).json({ message: err.message });
    }
};

export const updateAnnouncementController = async (req: Request, res: Response) => {
    try {
        const { announcementId } = req.params;
        const announcementData: UpdateAnnouncementDto = updateAnnouncementSchema.parse(req.body);
        const hostelId = req.user?.hostelId;

        if (!hostelId) {
            throw new HttpException(
                HttpStatus.FORBIDDEN,
                "You must be assigned to a hostel to update announcements"
            );
        }

        const updatedAnnouncement = await announcementHelper.updateAnnouncement(
            announcementId,
            hostelId,
            announcementData
        );

        res.status(HttpStatus.OK).json({
            message: "Announcement updated successfully",
            data: updatedAnnouncement,
        });
    } catch (error) {
        const err = formatPrismaError(error);
        res.status(err.status).json({ message: err.message });
    }
};

export const deleteAnnouncementController = async (req: Request, res: Response) => {
    try {
        const { announcementId } = req.params;
        const hostelId = req.user?.hostelId;

        if (!hostelId) {
            throw new HttpException(
                HttpStatus.FORBIDDEN,
                "You must be assigned to a hostel to delete announcements"
            );
        }

        const result = await announcementHelper.deleteAnnouncement(
            announcementId,
            hostelId
        );

        res.status(HttpStatus.OK).json(result);
    } catch (error) {
        const err = formatPrismaError(error);
        res.status(err.status).json({ message: err.message });
    }
};
