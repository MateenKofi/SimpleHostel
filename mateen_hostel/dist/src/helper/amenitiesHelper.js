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
exports.getAllAmenitiesForHostel = exports.deleteAmenity = exports.updateAmenity = exports.getAmenityById = exports.getAllAmenities = exports.addAmenity = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const amenitiesSchema_1 = require("../zodSchema/amenitiesSchema"); // Assuming you have Zod schemas for validation
const formatPrisma_1 = require("../utils/formatPrisma");
// Add an Amenity
const addAmenity = (amenityData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the amenity data using the schema
        const validateAmenity = amenitiesSchema_1.amenitiesSchema.safeParse(amenityData);
        if (!validateAmenity.success) {
            const errors = validateAmenity.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const hostel = yield prisma_1.default.hostel.findUnique({
            where: { id: amenityData.hostelId },
        });
        if (!hostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "hostel does not exist");
        }
        const hostelId = hostel.id;
        // Check if amenity already exists (if needed)
        const existingAmenity = yield prisma_1.default.amenities.findFirst({
            where: { name: amenityData.name, hostelId },
        });
        if (existingAmenity) {
            throw new http_error_1.default(http_status_1.HttpStatus.CONFLICT, "Amenity already exists");
        }
        // Create a new amenity
        const createdAmenity = yield prisma_1.default.amenities.create({
            data: amenityData,
        });
        return createdAmenity;
    }
    catch (error) {
        console.error("Error adding amenity:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.addAmenity = addAmenity;
// Get All Amenities
const getAllAmenities = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amenities = yield prisma_1.default.amenities.findMany();
        return amenities;
    }
    catch (error) {
        console.error("Error retrieving Amenities:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllAmenities = getAllAmenities;
// Get Amenity by ID
const getAmenityById = (amenityId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amenity = yield prisma_1.default.amenities.findUnique({
            where: { id: amenityId },
        });
        if (!amenity) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Amenity not found");
        }
        return amenity;
    }
    catch (error) {
        console.error("Error retrieving Amenity:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAmenityById = getAmenityById;
// Update an Amenity
const updateAmenity = (amenityId, amenityData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the amenity data using the schema
        const validateAmenity = amenitiesSchema_1.updateAmenitiesSchema.safeParse(amenityData);
        if (!validateAmenity.success) {
            const errors = validateAmenity.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        // Check if the amenity exists in the database
        const findAmenity = yield prisma_1.default.amenities.findUnique({
            where: { id: amenityId },
        });
        if (!findAmenity) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Amenity not found");
        }
        // Update the amenity
        const updatedAmenity = yield prisma_1.default.amenities.update({
            where: { id: amenityId },
            data: amenityData,
        });
        return updatedAmenity;
    }
    catch (error) {
        console.error("Error updating Amenity:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateAmenity = updateAmenity;
// Delete Amenity
const deleteAmenity = (amenityId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amenity = yield prisma_1.default.amenities.findUnique({
            where: { id: amenityId },
        });
        if (!amenity) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Amenity not found");
        }
        // Delete the amenity
        yield prisma_1.default.amenities.delete({
            where: { id: amenityId },
        });
        return { message: "Amenity deleted successfully" };
    }
    catch (error) {
        console.error("Error deleting Amenity:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.deleteAmenity = deleteAmenity;
const getAllAmenitiesForHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield prisma_1.default.amenities.findMany({
            where: {
                hostelId,
                hostel: {
                    deletedAt: null,
                },
            },
        });
        return rooms;
    }
    catch (error) {
        console.error("Error retrieving Amenities for hostel:", error);
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllAmenitiesForHostel = getAllAmenitiesForHostel;
