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
exports.deleteAnnouncement = exports.updateAnnouncement = exports.addAnnouncement = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const formatPrisma_1 = require("../utils/formatPrisma");
const addAnnouncement = (hostelId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const announcement = yield prisma_1.default.announcement.create({
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
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.addAnnouncement = addAnnouncement;
const updateAnnouncement = (announcementId, hostelId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify the announcement belongs to the user's hostel
        const existing = yield prisma_1.default.announcement.findUnique({
            where: { id: announcementId },
        });
        if (!existing) {
            const error = new Error("Announcement not found");
            error.status = 404;
            throw error;
        }
        if (existing.hostelId !== hostelId) {
            const error = new Error("You can only update announcements from your hostel");
            error.status = 403;
            throw error;
        }
        const announcement = yield prisma_1.default.announcement.update({
            where: { id: announcementId },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (data.title !== undefined && { title: data.title })), (data.content !== undefined && { content: data.content })), (data.category !== undefined && { category: data.category })), (data.priority !== undefined && { priority: data.priority })), (data.startDate !== undefined && { startDate: data.startDate })), (data.endDate !== undefined && { endDate: data.endDate })),
        });
        return announcement;
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = (announcementId, hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify the announcement belongs to the user's hostel
        const existing = yield prisma_1.default.announcement.findUnique({
            where: { id: announcementId },
        });
        if (!existing) {
            const error = new Error("Announcement not found");
            error.status = 404;
            throw error;
        }
        if (existing.hostelId !== hostelId) {
            const error = new Error("You can only delete announcements from your hostel");
            error.status = 403;
            throw error;
        }
        yield prisma_1.default.announcement.delete({
            where: { id: announcementId },
        });
        return { message: "Announcement deleted successfully" };
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.deleteAnnouncement = deleteAnnouncement;
