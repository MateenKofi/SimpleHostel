import { Request, Response } from "express";
import * as adminMaintenanceHelper from "../helper/adminMaintenanceHelper";
import { HttpStatus } from "../utils/http-status";
import { formatPrismaError } from "../utils/formatPrisma";
import { RequestStatus, Priority } from "@prisma/client";
import HttpException from "../utils/http-error";

export const getAllMaintenanceRequestsController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { status, priority } = req.query;
        const user = req.user;

        if (!user || !user.hostelId) {
            throw new HttpException(HttpStatus.FORBIDDEN, "Admin not assigned to a hostel");
        }

        const requests = await adminMaintenanceHelper.getAllMaintenanceRequests(
            user.hostelId,
            {
                status: status as RequestStatus,
                priority: priority as Priority,
            }
        );

        res.status(HttpStatus.OK).json({
            message: "Maintenance requests fetched successfully",
            data: requests,
        });
    } catch (error) {
        const err = formatPrismaError(error);
        res.status(err.status).json({ message: err.message });
    }
};

export const updateMaintenanceRequestController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { requestId } = req.params;
        const updateData = req.body;

        const request = await adminMaintenanceHelper.updateMaintenanceRequest(
            requestId,
            updateData
        );

        res.status(HttpStatus.OK).json({
            message: "Maintenance request updated successfully",
            data: request,
        });
    } catch (error) {
        const err = formatPrismaError(error);
        res.status(err.status).json({ message: err.message });
    }
};

export const getMaintenanceStatsController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user;

        if (!user || !user.hostelId) {
            throw new HttpException(HttpStatus.FORBIDDEN, "Admin not assigned to a hostel");
        }

        const stats = await adminMaintenanceHelper.getMaintenanceStats(user.hostelId);

        res.status(HttpStatus.OK).json({
            message: "Maintenance stats fetched successfully",
            data: stats,
        });
    } catch (error) {
        const err = formatPrismaError(error);
        res.status(err.status).json({ message: err.message });
    }
};
