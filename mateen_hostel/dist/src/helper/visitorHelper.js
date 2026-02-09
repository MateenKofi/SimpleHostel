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
exports.getVisitorsForHostel = exports.checkoutVisitor = exports.deleteVisitor = exports.updateVisitor = exports.getVisitorById = exports.getAllVisitors = exports.addVisitor = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const client_1 = require("@prisma/client");
const visitorSchema_1 = require("../zodSchema/visitorSchema"); // Assuming you have Zod schemas for validation
const formatPrisma_1 = require("../utils/formatPrisma");
// Add a Visitor
const addVisitor = (visitorData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the visitor data using the schema
        const validateVisitor = visitorSchema_1.visitorSchema.safeParse(visitorData);
        if (!validateVisitor.success) {
            const errors = validateVisitor.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        // Check if the visitor already exists by email or phone (or another unique identifier)
        const existingVisitor = yield prisma_1.default.visitor.findFirst({
            where: {
                OR: [{ email: visitorData.email }, { phone: visitorData.phone }],
            },
        });
        // If visitor exists, create a new entry with the same details (new visit)
        const visitorToCreate = existingVisitor
            ? Object.assign(Object.assign({}, visitorData), { status: client_1.VisitorStatus.active, residentId: existingVisitor.residentId }) : visitorData; // If the visitor does not exist, create a new one with all details
        // Create or reuse the visitor (if a repeat visitor)
        const createdVisitor = yield prisma_1.default.visitor.create({
            data: visitorToCreate,
        });
        return createdVisitor;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.addVisitor = addVisitor;
// Get All Visitors
const getAllVisitors = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitors = yield prisma_1.default.visitor.findMany({
            include: { resident: true },
        });
        return visitors;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllVisitors = getAllVisitors;
// Get Visitor by ID
const getVisitorById = (visitorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitor = yield prisma_1.default.visitor.findUnique({
            where: { id: visitorId },
            include: { resident: true },
        });
        if (!visitor) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Visitor not found");
        }
        return visitor;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getVisitorById = getVisitorById;
// Update a Visitor
const updateVisitor = (visitorId, visitorData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the visitor data using the schema
        const validateVisitor = visitorSchema_1.updateVisitorSchema.safeParse(visitorData);
        if (!validateVisitor.success) {
            const errors = validateVisitor.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        // Check if the visitor exists in the database
        const findVisitor = yield prisma_1.default.visitor.findUnique({
            where: { id: visitorId },
        });
        if (!findVisitor) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Visitor not found");
        }
        // Update the visitor details
        const updatedVisitor = yield prisma_1.default.visitor.update({
            where: { id: visitorId },
            data: visitorData,
        });
        return updatedVisitor;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateVisitor = updateVisitor;
// Delete a Visitor
const deleteVisitor = (visitorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitor = yield prisma_1.default.visitor.findUnique({
            where: { id: visitorId },
        });
        if (!visitor) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Visitor not found");
        }
        // Delete the visitor from the database
        yield prisma_1.default.visitor.delete({
            where: { id: visitorId },
        });
        return { message: "Visitor deleted successfully" };
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.deleteVisitor = deleteVisitor;
const checkoutVisitor = (visitorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the visitor by ID
        const visitor = yield prisma_1.default.visitor.findUnique({
            where: { id: visitorId },
            include: {
                resident: true, // Assuming you want to include the resident details as well
            },
        });
        // If visitor doesn't exist, throw an error
        if (!visitor) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Visitor not found");
        }
        // If the visitor is already checked out, throw an error
        if (visitor.status === client_1.VisitorStatus.checked_out) {
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, "Visitor is already checked out");
        }
        // Update the visitor's status to checked out
        const updatedVisitor = yield prisma_1.default.visitor.update({
            where: { id: visitorId },
            data: {
                status: client_1.VisitorStatus.checked_out,
            },
        });
        // Return the updated visitor information
        return updatedVisitor;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.checkoutVisitor = checkoutVisitor;
const getVisitorsForHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // First, ensure the hostel exists and is not deleted
        const hostel = yield prisma_1.default.hostel.findUnique({
            where: { id: hostelId },
        });
        if (!hostel) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Hostel not found");
        }
        // Now, query for visitors whose resident's room is in the specified hostel and is not deleted
        const visitors = yield prisma_1.default.visitor.findMany({
            where: {
                resident: {
                    room: {
                        hostelId, // Ensure the room belongs to the given hostel
                        hostel: {
                            deletedAt: null, // Ensure the hostel is not deleted
                        },
                    },
                },
            },
            include: {
                resident: true, // Include resident details
            },
        });
        return visitors;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getVisitorsForHostel = getVisitorsForHostel;
