"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMaintenanceStatusSchema = exports.createMaintenanceRequestSchema = exports.RequestStatusEnum = exports.PriorityEnum = exports.RequestTypeEnum = void 0;
const zod_1 = require("zod");
exports.RequestTypeEnum = zod_1.z.enum([
    "maintenance",
    "room_change",
    "item_replacement",
    "other",
]);
exports.PriorityEnum = zod_1.z.enum(["low", "medium", "high", "critical"]);
exports.RequestStatusEnum = zod_1.z.enum([
    "pending",
    "in_progress",
    "resolved",
    "rejected",
]);
exports.createMaintenanceRequestSchema = zod_1.z.object({
    type: exports.RequestTypeEnum,
    subject: zod_1.z.string().min(1, "Subject is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    priority: exports.PriorityEnum.optional().default("low"),
    images: zod_1.z.array(zod_1.z.string().url()).optional(),
});
exports.updateMaintenanceStatusSchema = zod_1.z.object({
    status: exports.RequestStatusEnum.optional(),
    priority: exports.PriorityEnum.optional(),
});
