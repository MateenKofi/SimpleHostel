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
exports.updateHostelDocuments = exports.updatePaymentSettings = exports.updateHostelRules = exports.unPublishHostel = exports.publishHostel = exports.getUnverifiedHostel = exports.updateHostel = exports.deleteHostel = exports.getHostelById = exports.getAllHostels = exports.addHostel = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const client_1 = require("@prisma/client");
const hostelSchema_1 = require("../zodSchema/hostelSchema");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const formatPrisma_1 = require("../utils/formatPrisma");
const dto_1 = require("../utils/dto");
const addHostel = (hostelData, pictures, logoInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateHostel = hostelSchema_1.hostelSchema.safeParse(hostelData);
        if (!validateHostel.success) {
            const errors = validateHostel.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        // Check for existing hostel
        const normalizedEmail = hostelData.email.trim().toLowerCase();
        const findHostel = yield prisma_1.default.hostel.findFirst({
            where: {
                email: normalizedEmail,
                deletedAt: null,
            },
        });
        if (findHostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.CONFLICT, "Hostel already registered with this email");
        }
        const createdHostel = yield prisma_1.default.hostel.create({
            data: Object.assign(Object.assign({}, hostelData), { email: normalizedEmail, logoUrl: logoInfo === null || logoInfo === void 0 ? void 0 : logoInfo.logoUrl, logoKey: logoInfo === null || logoInfo === void 0 ? void 0 : logoInfo.logoKey }),
        });
        if (!createdHostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, "error creating hostel");
        }
        // Handle hostel images
        if (pictures.length > 0) {
            const hostelImages = pictures.map((picture) => ({
                imageUrl: picture.imageUrl,
                imageKey: picture.imageKey,
                hostelId: createdHostel.id,
            }));
            yield prisma_1.default.hostelImage.createMany({ data: hostelImages });
        }
        return (0, dto_1.toHostelDto)(createdHostel);
    }
    catch (error) {
        console.error("Adding Hostel Error:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.addHostel = addHostel;
const getAllHostels = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostels = yield prisma_1.default.hostel.findMany({
            where: {
                deletedAt: null,
            },
            include: {
                rooms: {
                    include: { amenities: true, roomImages: true },
                },
                staffProfiles: {
                    include: { user: true },
                },
                adminProfiles: {
                    include: { user: true },
                },
                residentProfiles: true,
                amenities: true,
                hostelImages: true,
                calendarYears: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        name: true,
                        isActive: true,
                        startDate: true,
                        endDate: true,
                    },
                },
                feedbacks: {
                    select: { rating: true },
                },
            },
        });
        return hostels.map((hostel) => {
            const totalRating = hostel.feedbacks.reduce((sum, f) => sum + f.rating, 0);
            const averageRating = hostel.feedbacks.length > 0 ? totalRating / hostel.feedbacks.length : 0;
            return (0, dto_1.toHostelDto)(Object.assign(Object.assign({}, hostel), { averageRating }));
        });
    }
    catch (error) {
        console.error("Error retrieving hostels:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllHostels = getAllHostels;
const getHostelById = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostel = yield prisma_1.default.hostel.findUnique({
            where: {
                id: hostelId,
                deletedAt: null,
            },
            include: {
                rooms: {
                    include: {
                        amenities: true,
                        roomImages: true,
                    },
                },
                staffProfiles: {
                    include: { user: true },
                },
                adminProfiles: {
                    include: { user: true },
                },
                hostelImages: true,
                calendarYears: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        name: true,
                        isActive: true,
                        startDate: true,
                        endDate: true,
                    },
                },
                feedbacks: {
                    select: { rating: true },
                },
            },
        });
        const hostelData = hostel;
        const totalRating = hostelData.feedbacks.reduce((sum, f) => sum + f.rating, 0);
        const averageRating = hostelData.feedbacks.length > 0 ? totalRating / hostelData.feedbacks.length : 0;
        return (0, dto_1.toHostelDto)(Object.assign(Object.assign({}, hostelData), { averageRating }));
    }
    catch (error) {
        console.error("Error retrieving hostel:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getHostelById = getHostelById;
const deleteHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findHostel = yield prisma_1.default.hostel.findUnique({
            where: { id: hostelId },
            include: { hostelImages: true },
        });
        if (!findHostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Hostel not found");
        }
        yield prisma_1.default.hostel.update({
            where: { id: hostelId },
            data: { deletedAt: new Date() },
        });
        return { message: "Hostel soft deleted successfully" };
    }
    catch (error) {
        console.error("Error deleting hostel:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.deleteHostel = deleteHostel;
const updateHostel = (hostelId, hostelData, pictures, logoInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateHostel = hostelSchema_1.updateHostelSchema.safeParse(hostelData);
        if (!validateHostel.success) {
            const errors = validateHostel.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const findHostel = yield prisma_1.default.hostel.findUnique({
            where: { id: hostelId },
            include: { hostelImages: true },
        });
        if (!findHostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Hostel not found");
        }
        // Handle logo update
        if ((logoInfo === null || logoInfo === void 0 ? void 0 : logoInfo.logoUrl) && (logoInfo === null || logoInfo === void 0 ? void 0 : logoInfo.logoKey)) {
            if (findHostel.logoKey) {
                yield cloudinary_1.default.uploader.destroy(findHostel.logoKey);
            }
            hostelData.logoUrl = logoInfo.logoUrl;
            hostelData.logoKey = logoInfo.logoKey;
        }
        // Handle photos update only if new pictures are provided
        if (pictures.length > 0) {
            // Delete old images from Cloudinary
            for (const image of findHostel.hostelImages || []) {
                if (image.imageKey) {
                    try {
                        yield cloudinary_1.default.uploader.destroy(image.imageKey);
                    }
                    catch (e) {
                        console.warn("Failed to delete image from Cloudinary:", image.imageKey, e);
                    }
                }
            }
            // Delete image records from database
            yield prisma_1.default.hostelImage.deleteMany({
                where: { hostelId },
            });
            // Add new image records
            const hostelImages = pictures.map((picture) => ({
                imageUrl: picture.imageUrl,
                imageKey: picture.imageKey,
                hostelId,
            }));
            yield prisma_1.default.hostelImage.createMany({ data: hostelImages });
        }
        const updatedHostelWithDetails = yield prisma_1.default.hostel.findUnique({
            where: { id: hostelId },
            include: { hostelImages: true },
        });
        return updatedHostelWithDetails ? (0, dto_1.toHostelDto)(updatedHostelWithDetails) : null;
    }
    catch (error) {
        console.error("Update Hostel Error:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateHostel = updateHostel;
const getUnverifiedHostel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unverifiedHostel = yield prisma_1.default.hostel.findMany({
            where: {
                isVerified: false,
                deletedAt: null,
            },
        });
        return unverifiedHostel.map((h) => (0, dto_1.toHostelDto)(h));
    }
    catch (error) {
        console.error("Error retrieving hostels:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getUnverifiedHostel = getUnverifiedHostel;
const publishHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostel = yield prisma_1.default.hostel.findUnique({
            where: {
                id: hostelId,
                deletedAt: null,
            },
        });
        if (!hostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Hostel not found");
        }
        const isActive = yield prisma_1.default.calendarYear.findFirst({
            where: {
                hostelId: hostelId,
                isActive: true,
            },
        });
        if (!isActive) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Calendar year must be active before publishing hostel");
        }
        yield prisma_1.default.hostel.update({
            where: { id: hostelId },
            data: { state: client_1.HostelState.published },
        });
    }
    catch (error) {
        console.error("Publish Hostel Error:", error); //
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.publishHostel = publishHostel;
const unPublishHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostel = yield prisma_1.default.hostel.findUnique({
            where: {
                id: hostelId,
                deletedAt: null,
            },
        });
        if (!hostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Hostel not found");
        }
        yield prisma_1.default.hostel.update({
            where: { id: hostelId },
            data: { state: client_1.HostelState.unpublished },
        });
    }
    catch (error) {
        console.error("Unpublish Hostel Error:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.unPublishHostel = unPublishHostel;
const updateHostelRules = (hostelId, rulesInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findHostel = yield prisma_1.default.hostel.findUnique({
            where: { id: hostelId },
        });
        if (!findHostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Hostel not found");
        }
        if (findHostel.rulesKey) {
            yield cloudinary_1.default.uploader.destroy(findHostel.rulesKey);
        }
        const updatedHostelWithDetails = yield prisma_1.default.hostel.findUnique({
            where: { id: hostelId },
            include: { hostelImages: true },
        });
        return updatedHostelWithDetails ? (0, dto_1.toHostelDto)(updatedHostelWithDetails) : null;
    }
    catch (error) {
        console.error("Update Hostel Rules Error:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateHostelRules = updateHostelRules;
const updatePaymentSettings = (hostelId, settings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findHostel = yield prisma_1.default.hostel.findUnique({
            where: { id: hostelId },
        });
        if (!findHostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Hostel not found");
        }
        const updatedHostelWithDetails = yield prisma_1.default.hostel.findUnique({
            where: { id: hostelId },
            include: { hostelImages: true },
        });
        return updatedHostelWithDetails ? (0, dto_1.toHostelDto)(updatedHostelWithDetails) : null;
    }
    catch (error) {
        console.error("Update Payment Settings Error:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updatePaymentSettings = updatePaymentSettings;
const updateHostelDocuments = (hostelId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedHostelWithDetails = yield prisma_1.default.hostel.findUnique({
            where: { id: hostelId },
            include: { hostelImages: true },
        });
        return updatedHostelWithDetails ? (0, dto_1.toHostelDto)(updatedHostelWithDetails) : null;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateHostelDocuments = updateHostelDocuments;
