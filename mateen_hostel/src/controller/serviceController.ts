import { Request, Response } from "express";
import * as serviceHelper from "../helper/serviceHelper";
import { formatPrismaError } from "../utils/formatPrisma";
import { HttpStatus } from "../utils/http-status";
import HttpException from "../utils/http-error";
import { jwtDecode } from "jwt-decode";
import { UserPayload } from "../utils/jsonwebtoken";
import { CreateHostelServiceDto, BookServiceDto } from "../zodSchema/serviceSchema";

export const createHostelServiceController = async (req: Request, res: Response) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = jwtDecode(token) as UserPayload;

        const data: CreateHostelServiceDto = req.body;
        const service = await serviceHelper.createHostelService(decoded.id, data);

        res.status(HttpStatus.CREATED).json({
            message: "Hostel service created successfully",
            data: service,
        });
    } catch (error) {
        const err = formatPrismaError(error);
        res.status(err.status).json({ message: err.message });
    }
};

export const getHostelServicesController = async (req: Request, res: Response) => {
    try {
        let { hostelId } = req.params;
        const user = (req as any).user as UserPayload;

        // If user is a resident, always force their hostelId
        if (user?.role === "resident" && user.hostelId) {
            hostelId = user.hostelId;
        } else if (!hostelId && user?.hostelId) {
            hostelId = user.hostelId;
        }

        if (!hostelId) {
            throw new HttpException(HttpStatus.BAD_REQUEST, "Hostel ID is required");
        }

        const services = await serviceHelper.getHostelServices(hostelId);

        res.status(HttpStatus.OK).json({
            message: "Services fetched successfully",
            data: services,
        });
    } catch (error) {
        const err = formatPrismaError(error);
        res.status(err.status).json({ message: err.message });
    }
};

export const bookServiceController = async (req: Request, res: Response) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = jwtDecode(token) as UserPayload;

        const data: BookServiceDto = req.body;
        const booking = await serviceHelper.bookService(decoded.id, data);

        res.status(HttpStatus.CREATED).json({
            message: "Service booked successfully",
            data: booking,
        });
    } catch (error) {
        const err = formatPrismaError(error);
        res.status(err.status).json({ message: err.message });
    }
};

export const getResidentBookingsController = async (req: Request, res: Response) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) throw new HttpException(HttpStatus.UNAUTHORIZED, "No token provided");
        const token = authHeader.split(" ")[1];
        const decoded = jwtDecode(token) as UserPayload;

        const bookings = await serviceHelper.getResidentBookings(decoded.id);

        res.status(HttpStatus.OK).json({
            message: "Bookings fetched successfully",
            data: bookings,
        });
    } catch (error) {
        const err = formatPrismaError(error);
        res.status(err.status).json({ message: err.message });
    }
};
