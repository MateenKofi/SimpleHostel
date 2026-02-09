"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnnouncementSchema = exports.createAnnouncementSchema = void 0;
const zod_1 = require("zod");
exports.createAnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    content: zod_1.z.string().min(1, "Content is required"),
    category: zod_1.z.string().optional().default("general"),
    priority: zod_1.z.string().optional().default("normal"),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
});
exports.updateAnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").optional(),
    content: zod_1.z.string().min(1, "Content is required").optional(),
    category: zod_1.z.string().optional(),
    priority: zod_1.z.string().optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
});
