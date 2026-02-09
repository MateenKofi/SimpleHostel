import prisma from "../utils/prisma";
import {
    CreateHostelServiceDto,
    createHostelServiceSchema,
    BookServiceDto,
    bookServiceSchema,
} from "../zodSchema/serviceSchema";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { formatPrismaError } from "../utils/formatPrisma";

export const createHostelService = async (
    userId: string,
    data: CreateHostelServiceDto,
) => {
    try {
        const validate = createHostelServiceSchema.safeParse(data);
        if (!validate.success) {
            const errors = validate.error.issues.map(
                ({ message, path }) => `${path}: ${message}`,
            );
            throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
        }

        let hostelId: string;

        // If hostelId is provided in the request body (super_admin scenario)
        if (data.hostelId) {
            hostelId = data.hostelId;
        } else {
            // Otherwise, get hostelId from admin profile (regular admin scenario)
            const admin = await prisma.adminProfile.findUnique({
                where: { userId },
            });

            if (!admin || !admin.hostelId) {
                throw new HttpException(
                    HttpStatus.FORBIDDEN,
                    "User is not an admin of any hostel",
                );
            }

            hostelId = admin.hostelId;
        }

        const service = await prisma.hostelService.create({
            data: {
                hostelId,
                name: data.name,
                description: data.description,
                price: data.price,
                availability: data.availability,
            },
        });

        return service;
    } catch (error) {
        throw formatPrismaError(error);
    }
};

export const getHostelServices = async (hostelId: string) => {
    try {
        const services = await prisma.hostelService.findMany({
            where: { hostelId },
        });
        return services;
    } catch (error) {
        throw formatPrismaError(error);
    }
};

export const bookService = async (userId: string, data: BookServiceDto) => {
    try {
        const validate = bookServiceSchema.safeParse(data);
        if (!validate.success) {
            const errors = validate.error.issues.map(
                ({ message, path }) => `${path}: ${message}`,
            );
            throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
        }

        const resident = await prisma.residentProfile.findUnique({
            where: { userId },
        });

        if (!resident) {
            throw new HttpException(HttpStatus.NOT_FOUND, "Resident profile not found");
        }

        const service = await prisma.hostelService.findUnique({
            where: { id: data.serviceId },
        });

        if (!service) {
            throw new HttpException(HttpStatus.NOT_FOUND, "Service not found");
        }

        if (!service.availability) {
            throw new HttpException(HttpStatus.BAD_REQUEST, "Service is currently unavailable");
        }

        // Verify resident belongs to the same hostel as the service
        if (resident.hostelId !== service.hostelId) {
            throw new HttpException(
                HttpStatus.FORBIDDEN,
                "Cannot book service from another hostel",
            );
        }

        const booking = await prisma.serviceBooking.create({
            data: {
                residentId: resident.id,
                serviceId: service.id,
                bookingDate: data.bookingDate,
                status: "pending",
            },
        });

        return booking;
    } catch (error) {
        throw formatPrismaError(error);
    }
};

export const getResidentBookings = async (userId: string) => {
    try {
        const resident = await prisma.residentProfile.findUnique({
            where: { userId },
        });

        if (!resident) {
            throw new HttpException(HttpStatus.NOT_FOUND, "Resident profile not found");
        }

        const bookings = await prisma.serviceBooking.findMany({
            where: { residentId: resident.id },
            include: {
                service: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return bookings;
    } catch (error) {
        throw formatPrismaError(error);
    }
};
