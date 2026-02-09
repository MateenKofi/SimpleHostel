"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResidentBookings = exports.bookService = exports.getHostelServices = exports.createHostelService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const serviceSchema_1 = require("../zodSchema/serviceSchema");
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const formatPrisma_1 = require("../utils/formatPrisma");
const createHostelService = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validate = serviceSchema_1.createHostelServiceSchema.safeParse(data);
        if (!validate.success) {
            const errors = validate.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        let hostelId;
        // If hostelId is provided in the request body (super_admin scenario)
        if (data.hostelId) {
            hostelId = data.hostelId;
        }
        else {
            // Otherwise, get hostelId from admin profile (regular admin scenario)
            const admin = yield prisma_1.default.adminProfile.findUnique({
                where: { userId },
            });
            if (!admin || !admin.hostelId) {
                throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "User is not an admin of any hostel");
            }
            hostelId = admin.hostelId;
        }
        const service = yield prisma_1.default.hostelService.create({
            data: {
                hostelId,
                name: data.name,
                description: data.description,
                price: data.price,
                availability: data.availability,
            },
        });
        return service;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.createHostelService = createHostelService;
const getHostelServices = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield prisma_1.default.hostelService.findMany({
            where: { hostelId },
        });
        return services;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getHostelServices = getHostelServices;
const bookService = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validate = serviceSchema_1.bookServiceSchema.safeParse(data);
        if (!validate.success) {
            const errors = validate.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { userId },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident profile not found");
        }
        const service = yield prisma_1.default.hostelService.findUnique({
            where: { id: data.serviceId },
        });
        if (!service) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Service not found");
        }
        if (!service.availability) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Service is currently unavailable");
        }
        // Verify resident belongs to the same hostel as the service
        if (resident.hostelId !== service.hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "Cannot book service from another hostel");
        }
        const booking = yield prisma_1.default.serviceBooking.create({
            data: {
                residentId: resident.id,
                serviceId: service.id,
                bookingDate: data.bookingDate,
                status: "pending",
            },
        });
        return booking;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.bookService = bookService;
const getResidentBookings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resident = yield prisma_1.default.residentProfile.findUnique({
            where: { userId },
        });
        if (!resident) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Resident profile not found");
        }
        const bookings = yield prisma_1.default.serviceBooking.findMany({
            where: { residentId: resident.id },
            include: {
                service: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return bookings;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getResidentBookings = getResidentBookings;
