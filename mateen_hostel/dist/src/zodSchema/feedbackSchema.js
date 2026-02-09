"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedbackSchema = void 0;
const zod_1 = require("zod");
exports.createFeedbackSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
});
